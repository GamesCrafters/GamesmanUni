import * as GCTAPI from "../apis/gamesCrafters";
import * as GCTAPITypes from "../apis/gamesCrafters/types";
import * as GHAPI from "../apis/gitHub";
import type * as Types from "./types";
import * as Defaults from "../../models/datas/defaultApp";

const moveHistoryDelim = ':';

const deepcopy = (obj: Object) => {
    return JSON.parse(JSON.stringify(obj));
}

export const loadGames = async (app: Types.App, payload: { gameType: string; force?: boolean }) => {
    if (!payload.force && Object.keys(app.gameTypes[payload.gameType].games).length && (new Date().getTime() - app.gameTypes[payload.gameType].lastUpdated) / (1000 * 60 * 60 * 24) < 3 * (1000 * 60 * 60 * 24)) return app;
    const dataSource = payload.gameType === "puzzles" ? app.dataSources.onePlayerGameAPI : app.dataSources.twoPlayerGameAPI;
    const games = await GCTAPI.loadGames(dataSource, payload);
    if (!games) return undefined;
    app.gameTypes[payload.gameType].status = games.status;
    for (const game of games.response) {
        app.gameTypes[payload.gameType].games[game.gameId] = {
            ...Defaults.defaultGame,
            id: game.gameId,
            name: game.name,
            type: payload.gameType,
            status: game.status,
            gui_status: game.gui_status,
            variants: { ...Defaults.defaultVariants },
        };
    }
    app.gameTypes[payload.gameType].lastUpdated = new Date().getTime();
    return app;
};

export const loadVariants = async (app: Types.App, payload: { gameType: string; gameId: string; force?: boolean }) => {
    if (!Object.keys(app.gameTypes[payload.gameType].games).length) {
        const updatedApp = await loadGames(app, payload);
        if (!updatedApp) return undefined;
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
    for (const variant of variants.response.variants) {
        app.gameTypes[payload.gameType].games[payload.gameId].variants.variants[variant.variantId] = {
            id: variant.variantId,
            description: variant.description,
            startPosition: variant.startPosition,
            positions: { ...Defaults.defaultPositions },
            autogui_v2_data: variant.autogui_v2_data,
            status: variant.status,
            gui_status: variant.gui_status
        };
    }
    return app;
};

const formatMoveNames = (source: Array<{
    deltaRemoteness: number;
    move: string;
    moveName: string;
    moveValue: string;
    position: string;
    positionValue: string;
    remoteness: number
}>) => {
    const target: Types.MoveNames = { ...Defaults.defaultAvailableMoveNames };
    for (let i = 0; i < source.length; i++) {
        target[source[i].moveName ? source[i].moveName : source[i].move] = source[i].move;
    }
    return target;
}

const formatMoves = (source: Array<{
        deltaRemoteness: number;
        move: string;
        moveName: string;
        moveValue: string;
        position: string;
        positionValue: string;
        remoteness: number;
        mex: string;
    }>) => {
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
    if (!updatedPosition || updatedPosition.response.positionValue === "undecided") {
        return undefined;
    }
    positions[payload.position] = {
        status: updatedPosition.status,
        lastUpdated: new Date().getTime(),
        availableMoveNames: formatMoveNames(updatedPosition.response.moves),
        availableMoves: formatMoves(updatedPosition.response.moves),
        position: updatedPosition.response.position,
        positionValue: updatedPosition.response.positionValue,
        remoteness: updatedPosition.response.remoteness,
        mex: updatedPosition.response["mex"] || "",
    };
    return app;
};

export const preFetchNextPositions = async (app: Types.App, payload: { gameType: string; gameId: string; variantId: string; position: string }) => {
    const positions = app.gameTypes[payload.gameType].games[payload.gameId].variants.variants[payload.variantId].positions;
    for (const move of Object.values(positions[payload.position].availableMoves)) {
        if (!(move.position in positions)) {
            await loadPosition(app, { ...payload, position: move.position });
        }
    }
    return app;
};

const generateMatchId = (app: Types.App) => {
    const reservedIds = new Set(Object.keys(app.matches));
    let newId: number;
    do {
        newId = Math.floor(Math.random() * 10000);
    } while (newId in reservedIds);
    return newId;
};

export const initiateMatch = async (app: Types.App, payload: {
        gameType: string;
        gameId: string;
        variantId: string;
        startPosition?: string
}) => {
    const cachedGames = app.gameTypes[payload.gameType].games;
    if (!Object.keys(cachedGames).length ||
        !Object.keys(cachedGames[payload.gameId].variants.variants).length) {
        /* Load available variants if not found in cache. */
        const updatedApp = await loadVariants(app, payload);
        if (!updatedApp) return undefined;
    }

    const game = cachedGames[payload.gameId];
    let gameVariant = game.variants.variants[payload.variantId];
    const hasCustom = game.custom;
    if (!gameVariant && hasCustom) {
        /* Load the selected variant if not found in cache. */
        gameVariant = await loadVariant(app, payload);
        game.variants.variants[payload.variantId] = gameVariant;
    }

    let startPosition: string;
    if (!payload.startPosition) {
        /* Start Position not specified in payload, use default. */
        startPosition = gameVariant.startPosition;
    } else if (payload.startPosition === "random") {
        /* Requesting a random start position for puzzles. */
        const loaded = await GCTAPI.loadRandomPosition(
            `${app.dataSources.onePlayerGameAPI}/${payload.gameId}/${payload.variantId}/randpos`
        );
        startPosition = loaded ? loaded.response.position : gameVariant.startPosition;
    } else {
        /* Start position specified and assumed to be valid. */
        startPosition = payload.startPosition;
    }
    const posArr = startPosition.split('_');

    const updatedApp = await loadPosition(app, { ...payload, position: startPosition });
    if (!updatedApp) return undefined;

    app.currentMatch.startPosition = startPosition;
    app.currentMatch.moveHistory = game.name + moveHistoryDelim + startPosition;
    app.currentMatch.created = new Date().getTime();
    app.currentMatch.gameType = payload.gameType;
    app.currentMatch.gameId = payload.gameId;
    app.currentMatch.variantId = payload.variantId;
    app.currentMatch.id = generateMatchId(app);
    app.currentMatch.round = {
        id: 1,
        /* Unfortunately, there is no generic way to determine whose 
           turn it is from an AutoGUI v0 position string.
           In this case we always assume it's the first player's turn. */
        firstPlayerTurn: (posArr.length >= 5 ? posArr[1] === 'A' : true),
        move: "",
        moveName: "",
        moveValue: "",
        position: { ...gameVariant.positions[startPosition] }
    };
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
        autogui_v2_data: {},
        status: "",
        gui_status: "v0"
    };

    const variant: Types.Variant = {
        id: payload.variantId,
        description: payload.variantId,
        startPosition: variant_response.response.variant[0].startPosition,
        positions: { ...Defaults.defaultPositions },
        autogui_v2_data: variant_response.response.variant[0].autogui_v2_data,
        status: variant_response.status,
        gui_status: variant_response.gui_status
    }
    return variant;
};

export const getMaximumRemoteness = (app: Types.App, payload: { from: number; to: number }) => {
    const remotenesses = new Set<number>();
    for (let roundId = payload.from; roundId <= payload.to; roundId++) {
        const round = app.currentMatch.rounds[roundId];
        if (round.position.positionValue !== "draw") remotenesses.add(round.position.remoteness);
        if (app.options.showNextMoves) for (const availableMove in round.position.availableMoves) remotenesses.add(round.position.availableMoves[availableMove].remoteness);
    }
    return Math.max(...remotenesses);
};

export const isEndOfMatch = (app: Types.App) =>
    !app.currentMatch.round.position.remoteness &&
    app.currentMatch.round.position.positionValue !== "draw" &&
    !Object.keys(app.currentMatch.round.position.availableMoves).length;

export const exitMatch = (app: Types.App) => {
    if (Object.entries(app.currentMatch.rounds).length > 1) { 
        app.currentMatch.lastPlayed = new Date().getTime();
        app.currentMatch.rounds[app.currentMatch.round.id] = { ...app.currentMatch.round };
        app.matches[app.currentMatch.id] = deepcopy(app.currentMatch);
    }
    app.currentMatch = deepcopy(Defaults.defaultMatch);
    return app;
};

export const generateComputerMove = (round: Types.Round) => {
    const availableMoves = Object.values(round.position.availableMoves);
    const currentPositionValue = round.position.positionValue;
    let bestMoves = availableMoves.filter((availableMove) => availableMove.moveValue === currentPositionValue);
    if (currentPositionValue === "win" || currentPositionValue === "tie") {
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
    if (app.currentMatch.round.position.availableMoves[payload.move].hasOwnProperty('moveName')) {
        app.currentMatch.round.moveName = app.currentMatch.round.position.availableMoves[payload.move].moveName;
    } else {
        app.currentMatch.round.moveName = app.currentMatch.round.position.availableMoves[payload.move].move;
    }
    // If runMove immediately after undoing, rewrite history by deleting all subsequent moves made ealier.
    for (let roundId = app.currentMatch.round.id;
         roundId <= Math.max(...Object.keys(app.currentMatch.rounds).map((roundId) => parseInt(roundId)));
         roundId++) {
        delete app.currentMatch.rounds[roundId];
    }
    app.currentMatch.rounds[app.currentMatch.round.id] = deepcopy(app.currentMatch.round);
    if (!isEndOfMatch(app)) {
        const updatedApp = await loadPosition(app, {
            gameType: app.currentMatch.gameType,
            gameId: app.currentMatch.gameId,
            variantId: app.currentMatch.variantId,
            position: app.currentMatch.round.position.availableMoves[payload.move].position
        });
        if (!updatedApp) return undefined;
        const updatedPosition = { 
            ...updatedApp.
            gameTypes[app.currentMatch.gameType].
            games[app.currentMatch.gameId].
            variants.
            variants[app.currentMatch.variantId].
            positions[
                app.
                currentMatch.
                round.
                position.
                availableMoves[payload.move].
                position
            ]
        };
        const move = app.currentMatch.round.position.availableMoves[payload.move];
        app.currentMatch.moveHistory += moveHistoryDelim + (move.moveName ? move.moveName : move.move);
        app.currentMatch.round.id += 1;
        if (app.currentMatch.gameType != "puzzles") {
            app.currentMatch.round.firstPlayerTurn = !app.currentMatch.round.firstPlayerTurn;
        }
        app.currentMatch.round.move = "";
        app.currentMatch.round.moveValue = "";
        app.currentMatch.round.position = updatedPosition;
        app.currentMatch.rounds[app.currentMatch.round.id] = { ...app.currentMatch.round };
        app.currentMatch.lastPlayed = new Date().getTime();
    }
    return app;
};

const popMovesFromHistory = (history: string, count?: number) => {
    let i = history.length - 1;
    if (!count) {
        count = 1;
    }
    while (count > 0 && i >= 0) {
        if (history[i--] === moveHistoryDelim) {
            --count;
        }
    }
    if (++i <= 1) {
        console.error("popMoveFromHistory: popping from empty move list")
        return "";
    }
    return history.substring(0, i);
}

export const redoMove = (app: Types.App, payload?: { count?: number }) => {
    const count = payload && payload.count ? payload.count : 1;
    const newRoundId = Math.min(Math.max(...Object.values(app.currentMatch.rounds).map((round) => round.id)), app.currentMatch.round.id + count);
    // Modify move history before changing current round id.
    for (let i = app.currentMatch.round.id; i < newRoundId; ++i) {
        app.currentMatch.moveHistory += moveHistoryDelim + (
            app.currentMatch.rounds[i].moveName ?
            app.currentMatch.rounds[i].moveName :
            app.currentMatch.rounds[i].move
        );
    }
    app.currentMatch.round = { ...app.currentMatch.rounds[newRoundId] };
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

export const undoMove = (app: Types.App, payload?: { count?: number }) => {
    const count = payload && payload.count ? payload.count : 1;
    const newRoundId = Math.max(1, app.currentMatch.round.id - count);
    // Modify move history.
    app.currentMatch.moveHistory = popMovesFromHistory(app.currentMatch.moveHistory, count);
    app.currentMatch.round = { ...app.currentMatch.rounds[newRoundId] };
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

export const updateGameTheme = (app: Types.App, payload: { gameTheme : string }) => {
    app.currentMatch.gameTheme = payload.gameTheme || "";
    return app;
}

export const updateMatchStartPosition = async (app: Types.App, payload: { position: string }) => {
    // Check if position is valid
    payload.position = payload.position.replace(/(\r\n|\n|\r)/gm, "");
    const updatedApp = await loadPosition(app, {
        gameType: app.currentMatch.gameType,
        gameId: app.currentMatch.gameId,
        variantId: app.currentMatch.variantId,
        position: payload.position
    });
    if (!updatedApp) {
        return Error("invalid position [" + payload.position + "]");
    }
    // Position is valid, update app.
    app.currentMatch.startPosition = payload.position;
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

export const loadMoveHistory = async (app: Types.App, payload: { history: string }) => {
    // Parse and load initial position, return undefined if initial position is invalid
    payload.history = payload.history.replace(/(\r\n|\n|\r)/gm, "");
    let parsed = payload.history.split(moveHistoryDelim);
    if (parsed.length < 2) {
        return Error("game name or start position missing");
    }
    let newApp: Types.App = deepcopy(app);
    const updatedAppOrError = await updateMatchStartPosition(newApp, { position: parsed[1] });
    if (updatedAppOrError instanceof Error) {
        return updatedAppOrError;
    }
    exitMatch(newApp);
    let updatedApp = await initiateMatch(newApp, {
        gameType: app.currentMatch.gameType,
        gameId: app.currentMatch.gameId,
        variantId: app.currentMatch.variantId,
        startPosition: parsed[1]
    });
    if (!updatedApp) {
        return Error("UNREACHED: initiateMatch failed");
    }
    // Do move one by one, return undefined if any move is invalid
    for (let i = 2; i < parsed.length; ++i) {
        const nextMove = newApp.currentMatch.round.position.availableMoveNames[parsed[i]];
        if (!nextMove) {
            return Error("invalid move [" + parsed[i] + "]");
        }
        updatedApp = await runMove(newApp, { move: nextMove });
        if (!updatedApp) {
            return Error("UNREACHED: runMove returned undefined");
        }
    }
    // Load successful, update app.
    return newApp;
}
