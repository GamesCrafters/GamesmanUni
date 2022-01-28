import * as GCTAPI from "../apis/gamesCrafters";
import * as GCTAPITypes from "../apis/gamesCrafters/types";
import * as GHAPI from "../apis/gitHub";
import type * as Types from "./types";
import * as Defaults from "../../models/datas/defaultApp";

export const loadGames = async (app: Types.App, payload: { gameType: string; force?: boolean }) => {
    if (!payload.force && Object.keys(app.gameTypes[payload.gameType].games).length && (new Date().getTime() - app.gameTypes[payload.gameType].lastUpdated) / (1000 * 60 * 60 * 24) < 3 * (1000 * 60 * 60 * 24)) return app;
    const dataSource = payload.gameType === "puzzles" ? app.dataSources.onePlayerGameAPI : app.dataSources.twoPlayerGameAPI;
    const games = await GCTAPI.loadGames(dataSource, payload);
    if (!games) return undefined;
    app.gameTypes[payload.gameType].status = games.status;
    for (const game of games.response)
        app.gameTypes[payload.gameType].games[game.gameId] = {
            ...Defaults.defaultGame,
            id: game.gameId,
            name: game.name,
            type: payload.gameType,
            status: game.status,
            variants: { ...Defaults.defaultVariants },
        };
    app.gameTypes[payload.gameType].lastUpdated = new Date().getTime();
    return app;
};

export const loadVariants = async (app: Types.App, payload: { gameType: string; gameId: string; force?: boolean }) => {
    if (!Object.keys(app.gameTypes[payload.gameType].games).length) {
        const updatedApp = await loadGames(app, payload);
        if (updatedApp) app = updatedApp;
        else return undefined;
    }
    if (!payload.force && app.gameTypes[payload.gameType].games[payload.gameId] && Object.keys(app.gameTypes[payload.gameType].games[payload.gameId].variants.variants).length && (new Date().getTime() - app.gameTypes[payload.gameType].games[payload.gameId].variants.lastUpdated) / (1000 * 60 * 60 * 24) < 3 * (1000 * 60 * 60 * 24)) return app;
    const baseDataSource = payload.gameType === "puzzles" ? app.dataSources.onePlayerGameAPI : app.dataSources.twoPlayerGameAPI;
    const variants = await GCTAPI.loadVariants(baseDataSource + `/${payload.gameId}`, payload);
    if (!variants) return undefined;
    app.gameTypes[payload.gameType].games[payload.gameId].variants.status = variants.status;
    app.gameTypes[payload.gameType].games[payload.gameId].variants.lastUpdated = new Date().getTime();
    if (payload.gameType === "puzzles") app.gameTypes[payload.gameType].games[payload.gameId].author = (<GCTAPITypes.OnePlayerGameVariants>variants).response.author;
    app.gameTypes[payload.gameType].games[payload.gameId].dateCreated = (<GCTAPITypes.OnePlayerGameVariants>variants).response.dateCreated;
    app.gameTypes[payload.gameType].games[payload.gameId].description = (<GCTAPITypes.OnePlayerGameVariants>variants).response.description;
    app.gameTypes[payload.gameType].games[payload.gameId].instructions = variants.response.instructions;
    app.gameTypes[payload.gameType].games[payload.gameId].custom = variants.response.custom === "true";
    app.gameTypes[payload.gameType].games[payload.gameId].variants.variants = {};
    for (const variant of variants.response.variants)
        app.gameTypes[payload.gameType].games[payload.gameId].variants.variants[variant.variantId] = {
            id: variant.variantId,
            description: variant.description,
            startPosition: variant.startPosition,
            positions: { ...Defaults.defaultPositions },
            status: variant.status,
        };
    return app;
};

const formatMoves = (source: Array<{ deltaRemoteness: number; move: string; moveValue: string; position: string; positionValue: string; remoteness: number }>) => {
    const target: Types.Moves = { ...Defaults.defaultAvailableMoves };
    if (source.length) target[source[0].move] = { ...source[0], moveValueOpacity: 1 };
    for (let i = 1; i < source.length; i++) {
        target[source[i].move] = { ...source[i], moveValueOpacity: 1 };
        const previousMove = target[source[i - 1].move];
        const currentMove = target[source[i].move];
        if (previousMove.moveValue !== currentMove.moveValue) continue;
        if (previousMove.moveValueOpacity === 0.5) currentMove.moveValueOpacity = 0.5;
        else if (previousMove.deltaRemoteness !== currentMove.deltaRemoteness) currentMove.moveValueOpacity = previousMove.moveValueOpacity - 0.25;
        else currentMove.moveValueOpacity = previousMove.moveValueOpacity;
    }
    return target;
};

const loadPosition = async (app: Types.App, payload: { gameType: string; gameId: string; variantId: string; position: string; force?: boolean }) => {
    const positions = app.gameTypes[payload.gameType].games[payload.gameId].variants.variants[payload.variantId].positions;
    if (!payload.force && positions[payload.position] && (new Date().getTime() - positions[payload.position].lastUpdated) / (1000 * 60 * 60 * 24) < 3 * (1000 * 60 * 60 * 24)) return app;
    const dataSource = payload.gameType === "puzzles" ? `${app.dataSources.onePlayerGameAPI}/${payload.gameId}/${payload.variantId}/${payload.position}` : `${app.dataSources.twoPlayerGameAPI}/${payload.gameId}/variants/${payload.variantId}/positions/${payload.position}`;
    const updatedPosition = await GCTAPI.loadPosition(dataSource);
    if (!updatedPosition) return undefined;
    positions[payload.position] = {
        status: updatedPosition.status,
        lastUpdated: new Date().getTime(),
        availableMoves: formatMoves(updatedPosition.response.moves),
        position: updatedPosition.response.position,
        positionValue: updatedPosition.response.positionValue,
        remoteness: updatedPosition.response.remoteness,
    };
    return app;
};

export const preFetchNextPositions = async (app: Types.App, payload: { gameType: string; gameId: string; variantId: string; position: string }) => {
    const positions = app.gameTypes[payload.gameType].games[payload.gameId].variants.variants[payload.variantId].positions;
    for (const move of Object.values(positions[payload.position].availableMoves)) if (!(move.position in positions)) await loadPosition(app, { ...payload, position: move.position });
    return app;
};

const generateMatchId = (app: Types.App) => {
    const reservedIds = new Set(...app.currentMatch!.players.map((player) => Object.keys(app.users[player].matches)));
    let newId: number;
    do {
        newId = Math.floor(Math.random() * 10000);
    } while (newId in reservedIds);
    return newId;
};

export const initiateMatch = async (app: Types.App, payload: { gameType: string; gameId: string; variantId: string; matchType?: string }) => {
    if (!Object.keys(app.gameTypes[payload.gameType].games).length || !Object.keys(app.gameTypes[payload.gameType].games[payload.gameId].variants.variants).length) {
        const updatedApp = await loadVariants(app, payload);
        if (updatedApp) app = updatedApp;
        else return undefined;
    }

    const has_custom = app.gameTypes[payload.gameType].games[payload.gameId].custom;
    let game = app.gameTypes[payload.gameType].games[payload.gameId].variants.variants[payload.variantId];
    if (!game && has_custom) {
        game = await loadVariant(app, payload);
        app.gameTypes[payload.gameType].games[payload.gameId].variants.variants[payload.variantId] = game;
    }

    const updatedApp = await loadPosition(app, { ...payload, position: game.startPosition });
    if (!updatedApp) return undefined;
    app.currentMatch = Defaults.defaultMatch;
    app.currentMatch.created = new Date().getTime();
    app.currentMatch.gameType = payload.gameType;
    app.currentMatch.gameId = payload.gameId;
    app.currentMatch.variantId = payload.variantId;
    app.currentMatch.type = payload.matchType ? payload.matchType : payload.gameType === "puzzles" ? "p" : game.positions[game.startPosition].positionValue === "lose" ? "cvp" : "pvc";
    app.currentMatch.players = app.currentMatch.gameType === "puzzles" ? [app.currentMatch.type + "1"] : app.currentMatch.type === "pvc" ? ["p1", "c1"] : app.currentMatch.type === "cvp" ? ["c1", "p1"] : app.currentMatch.type === "cvc" ? ["c1", "c2"] : app.currentMatch.type === "pvp" ? ["p1", "p2"] : [];
    app.currentMatch.id = generateMatchId(app);
    app.currentMatch.startingPlayerId = app.currentMatch.players[0];
    app.currentMatch.round = { id: 1, playerId: app.currentMatch.startingPlayerId, players: [...app.currentMatch.players], move: "", moveValue: "", position: { ...game.positions[game.startPosition] } };
    app.currentMatch.ended = 0;
    app.currentMatch.rounds[app.currentMatch.round.id] = { ...app.currentMatch.round };
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

const loadVariant = async (app: Types.App, payload: { gameType: string; gameId: string; variantId: string; force?: boolean }) => {
    const baseDataSource = payload.gameType === "puzzles" ? app.dataSources.onePlayerGameAPI : app.dataSources.twoPlayerGameAPI;
    const variant_response = await GCTAPI.loadVariant(baseDataSource + `/${payload.gameId}/variants/${payload.variantId}`, payload);
    if (!variant_response) return {
        id: "",
        description: "",
        startPosition: "",
        positions: {},
        status: ""
    };

    const variant: Types.Variant = {
        id: payload.variantId,
        description: payload.variantId,
        startPosition: variant_response.response.variant[0].startPosition,
        positions: { ...Defaults.defaultPositions },
        status: variant_response.status,
    }
    return variant;
};

export const getMaximumRemoteness = (app: Types.App, payload: { from: number; to: number }) => {
    const remotenesses = new Set<number>();
    for (let roundId = payload.from; roundId <= payload.to; roundId++) {
        const round = app.currentMatch.rounds[roundId];
        if (round.position.positionValue !== "draw") remotenesses.add(round.position.remoteness);
        if (app.users[app.currentMatch.rounds[payload.to].playerId].options.showNextMoves) for (const availableMove in round.position.availableMoves) remotenesses.add(round.position.availableMoves[availableMove].remoteness);
    }
    return Math.max(...remotenesses);
};

export const isEndOfMatch = (app: Types.App) => !app.currentMatch.round.position.remoteness && app.currentMatch.round.position.positionValue !== "draw" && !Object.keys(app.currentMatch.round.position.availableMoves).length;

export const exitMatch = (app: Types.App) => {
    if (Object.entries(app.currentMatch.rounds).length <= 1) return app;
    if (!isEndOfMatch(app)) {
        app.currentMatch.lastPlayed = new Date().getTime();
        app.currentMatch.rounds[app.currentMatch.round.id] = app.currentMatch.round;
        for (const player of app.currentMatch.players) app.users[player].matches[app.currentMatch.id] = app.currentMatch;
    }
    app.currentMatch = { ...Defaults.defaultMatch };
    return app;
};

export const generateComputerMove = (round: Types.Round) => {
    const availableMoves = Object.values(round.position.availableMoves);
    const currentPositionValue = round.position.positionValue;
    let bestMoves = availableMoves.filter((availableMove) => availableMove.moveValue === currentPositionValue);
    if (currentPositionValue === "win" || "tie") {
        const minimumRemoteness = Math.min(...bestMoves.map((bestMove) => bestMove.remoteness));
        bestMoves = bestMoves.filter((availableMove) => availableMove.remoteness === minimumRemoteness);
    } else if (currentPositionValue === "lose") {
        const maximumRemoteness = Math.max(...bestMoves.map((bestMove) => bestMove.remoteness));
        bestMoves = availableMoves.filter((availableMove) => availableMove.remoteness === maximumRemoteness);
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
};

export const runMove = async (app: Types.App, payload: { move: string }) => {
    app.currentMatch.round.move = payload.move;
    app.currentMatch.round.moveValue = app.currentMatch.round.position.availableMoves[payload.move].moveValue;
    for (let roundId = app.currentMatch.round.id; roundId <= Math.max(...Object.keys(app.currentMatch.rounds).map((roundId) => parseInt(roundId))); roundId++) delete app.currentMatch.rounds[roundId];
    app.currentMatch.rounds[app.currentMatch.round.id] = { ...app.currentMatch.round };
    if (isEndOfMatch(app)) {
        app.currentMatch.lastPlayed = new Date().getTime();
        app.currentMatch.ended = new Date().getTime();
        for (const player of app.currentMatch.players) app.users[player].matches[app.currentMatch.id] = app.currentMatch;
    } else {
        const updatedApp = await loadPosition(app, { gameType: app.currentMatch.gameType, gameId: app.currentMatch.gameId, variantId: app.currentMatch.variantId, position: app.currentMatch.round.position.availableMoves[payload.move].position });
        if (!updatedApp) return undefined;
        const updatedPosition = updatedApp.gameTypes[app.currentMatch.gameType].games[app.currentMatch.gameId].variants.variants[app.currentMatch.variantId].positions[app.currentMatch.round.position.availableMoves[payload.move].position];
        app.currentMatch.round.id += 1;
        app.currentMatch.round.players = [...app.currentMatch.round.players];
        if (app.currentMatch.gameType != "puzzles") {
          let posArr = updatedPosition.position.split('_');
          if (posArr.length === 5 && posArr[0] === 'R') {
            app.currentMatch.round.playerId = posArr[1] === 'A' ? app.currentMatch.players[0] : app.currentMatch.players[1];
          } else {
            app.currentMatch.round.playerId = app.currentMatch.round.playerId === app.currentMatch.players[0] ? app.currentMatch.players[1] : app.currentMatch.players[0];
          }
        }
        app.currentMatch.round.move = "";
        app.currentMatch.round.moveValue = "";
        app.currentMatch.round.position = updatedPosition;
        app.currentMatch.rounds[app.currentMatch.round.id] = { ...app.currentMatch.round };
        app.currentMatch.lastPlayed = new Date().getTime();
    }
    return app;
};

export const redoMove = async (app: Types.App, payload?: { count?: number }) => {
    const count = payload && payload.count ? payload.count : 1;
    const newRoundId = Math.min(Math.max(...Object.values(app.currentMatch.rounds).map((round) => round.id)), app.currentMatch.round.id + count);
    app.currentMatch.round = { ...app.currentMatch.rounds[newRoundId] };
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

export const undoMove = async (app: Types.App, payload?: { count?: number }) => {
    const count = payload && payload.count ? payload.count : 1;
    const newRoundId = Math.max(1, app.currentMatch.round.id - count);
    app.currentMatch.round = { ...app.currentMatch.rounds[newRoundId] };
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

export const updateMatchType = (app: Types.App, payload: { matchType: string, players: Array<string> }) => {
    app.currentMatch.type = payload.matchType;
    const currentTurnIndex = app.currentMatch.players.indexOf(app.currentMatch.round.playerId);
    app.currentMatch.players = [...payload.players];
    app.currentMatch.round.players = [...payload.players];
    app.currentMatch.round.playerId = app.currentMatch.players[currentTurnIndex];
    return app;
}

export const loadCommits = async (app: Types.App, payload?: { force?: boolean }) => {
    if (!(payload && payload.force) && Object.keys(app.commits.commits).length && (new Date().getTime() - app.commits.lastUpdated) / (1000 * 60 * 60 * 24) < 3 * (1000 * 60 * 60 * 24)) return app;
    const commits = await GHAPI.loadLatestCommits(app.dataSources.gitHubRepositoryAPI + "/commits");
    if (!commits) return undefined;
    app.commits.lastUpdated = new Date().getTime();
    for (const commit of commits) {
        app.commits.commits[commit.sha] = {
            date: <string>commit.commit.author?.date,
            message: commit.commit.message,
            sha: commit.sha,
            url: commit.html_url,
            authorName: <string>commit.commit.author?.name,
            authorUsername: <string>commit.author?.login,
            authorAvatarUrl: <string>commit.author?.avatar_url,
            authorGitHubUrl: <string>commit.author?.html_url,
        };
    }
    return app;
};
