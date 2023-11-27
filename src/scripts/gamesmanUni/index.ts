import * as GCTAPI from "../apis/gamesCrafters";
import * as GCTAPITypes from "../apis/gamesCrafters/types";
import * as GHAPI from "../apis/gitHub";
import type * as Types from "./types";
import * as Defaults from "../../models/datas/defaultApp";
import { handleMoveAnimation, animationEpilogue } from "./moveAnimation"
import { useStore } from "../plugins/store";
const moveHistoryDelim = ':';

const deepcopy = (obj: Object) => {
    return JSON.parse(JSON.stringify(obj));
};

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
            imageAutoGUIData: variant.imageAutoGUIData,
            status: variant.status,
            gui_status: variant.gui_status
        };
    }
    app.gameTypes[payload.gameType].games[payload.gameId].supportsWinBy = payload.gameType === "games" ? (<GCTAPITypes.TwoPlayerGameVariants>variants).response.supportsWinBy : Defaults.defaultGame.supportsWinBy;
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
};

const formatMoves = (source: Array<{
        deltaRemoteness: number;
        move: string;
        moveName: string;
        moveValue: string;
        position: string;
        positionValue: string;
        remoteness: number;
        winby: number;
        mex: string;
        drawLevel: number;
        drawRemoteness: number;
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
        winby: updatedPosition.response.winby,
        mex: updatedPosition.response["mex"] || "",
        drawLevel: "drawLevel" in updatedPosition.response ? updatedPosition.response["drawLevel"] : -1,
        drawRemoteness: "drawRemoteness" in updatedPosition.response ? updatedPosition.response["drawRemoteness"] : -1
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
        startPosition?: string;
        firstPlayerIsComputer?: boolean;
        secondPlayerIsComputer?: boolean;
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
        /* Load the selected custom variant if not found in cache. */
        gameVariant = await loadVariant(app, payload);
        game.variants.variants[payload.variantId] = gameVariant;
    }

    let startPosition: string;
    if (!payload.startPosition) {
        /* Start Position not specified in payload, use default. */
        startPosition = gameVariant.startPosition;
    } else if (payload.startPosition === "random") {
        /* Requesting a random start position for puzzles. */
        const ds = (payload.gameType == "puzzles") ? `${app.dataSources.onePlayerGameAPI}` : `${app.dataSources.twoPlayerGameAPI}`
        const loaded = await GCTAPI.loadRandomPosition(
            `${ds}/${payload.gameId}/${payload.variantId}/randpos`
        );
        startPosition = loaded ? loaded.response.position : gameVariant.startPosition;
    } else {
        /* Start position specified and assumed to be valid. */
        startPosition = payload.startPosition;
    }
    const posArr = startPosition.split('_');

    const updatedApp = await loadPosition(app, { ...payload, position: startPosition });
    if (!updatedApp) return undefined;

    if (!game.supportsWinBy) app.CPUsStrategy = Defaults.defaultCPUsStrategy;
    app.currentMatch.gameTheme = gameVariant.imageAutoGUIData ? gameVariant.imageAutoGUIData.defaultTheme : "";
    app.currentMatch.startPosition = startPosition;
    app.currentMatch.moveHistory = game.name + moveHistoryDelim + startPosition;
    app.currentMatch.created = new Date().getTime();
    app.currentMatch.gameType = payload.gameType;
    app.currentMatch.gameId = payload.gameId;
    app.currentMatch.variantId = payload.variantId;
    app.currentMatch.id = generateMatchId(app);
    if (!(payload.firstPlayerIsComputer === undefined)) app.currentMatch.firstPlayer.isComputer = payload.firstPlayerIsComputer;
    if (!(payload.secondPlayerIsComputer === undefined)) app.currentMatch.secondPlayer.isComputer = payload.secondPlayerIsComputer;
    app.currentMatch.round = {
        id: 1,
        /* Unfortunately, there is no generic way to determine whose 
           turn it is from an AutoGUI v0 position string.
           In this case we always assume it's the first player's turn. */
        firstPlayerTurn: (posArr.length >= 5 ? posArr[1] === 'A' : true),
        move: "",
        moveName: "",
        moveValue: "",
        position: deepcopy(gameVariant.positions[startPosition])
    };
    app.currentMatch.rounds = [
        deepcopy(Defaults.defaultRound),
        deepcopy(app.currentMatch.round)
    ];
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

export const restartMatch = async (app: Types.App) => {
    const posArr = app.currentMatch.startPosition.split('_');
    const gameType = app.currentMatch.gameType;
    const gameId = app.currentMatch.gameId;
    const variantId = app.currentMatch.variantId
    const game = app.gameTypes[gameType].games[gameId];
    const startPosition = app.currentMatch.startPosition;

    /* Reset round id to 1 and delete all existing rounds. */
    app.currentMatch.round = {
        id: 1,
        firstPlayerTurn: (posArr.length >= 5 ? posArr[1] === 'A' : true),
        move: "",
        moveName: "",
        moveValue: "",
        position: deepcopy(game.variants.variants[variantId].positions[startPosition])
    };
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveName = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.rounds = [
        deepcopy(Defaults.defaultRound),
        deepcopy(app.currentMatch.round)
    ];
    app.currentMatch.moveHistory = game.name + moveHistoryDelim + startPosition;
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

// This function is for custom variants.
const loadVariant = async (app: Types.App, payload: { gameType: string; gameId: string; variantId: string; force?: boolean }) => {
    const baseDataSource = payload.gameType === "puzzles" ? app.dataSources.onePlayerGameAPI : app.dataSources.twoPlayerGameAPI;
    const variant_response = await GCTAPI.loadVariant(baseDataSource + `/${payload.gameId}/variants/${payload.variantId}`, payload);
    if (!variant_response) return {
        id: "",
        description: "",
        startPosition: "",
        positions: {},
        imageAutoGUIData: {} as GCTAPITypes.ImageAutoGUIData,
        status: "",
        gui_status: "v0"
    };

    return {
        id: payload.variantId,
        description: variant_response.response.variant[0].description,
        startPosition: variant_response.response.variant[0].startPosition,
        positions: { ...Defaults.defaultPositions },
        imageAutoGUIData: variant_response.response.variant[0].imageAutoGUIData,
        status: variant_response.status,
        gui_status: variant_response.gui_status
    };
};

/** 
 * Determines the maximum Remoteness value between rounds payload.from to payload.to. If there is no Remoteness value greater
 * than the threshold of 5, then returns the threshold.
 * @param {Types.App} app - App.
 * @param {number} payload.from - round id to start calculating the maximum Remoteness value.
 * @param {number} payload.to - round id to end calculating the maximum Remoteness value.
 * @returns the maximum Remoteness value when it is greater than the threshold, else returns the threshold.
*/
export const getMaximumRemoteness = (app: Types.App, payload: { from: number; to: number }) => {
    const remotenesses = new Set<number>();
    remotenesses.add(5); // In case all involved positions are draw, 5 shall be the default maximum remoteness.
    for (let roundId = payload.from; roundId <= payload.to; roundId++) {
        const round = app.currentMatch.rounds[roundId];
        if (round.position.positionValue !== "draw") remotenesses.add(round.position.remoteness);
        if (app.options.showNextMoves) {
            for (const availableMove in round.position.availableMoves) {
                if (round.position.availableMoves[availableMove].positionValue !== "draw") {
                    remotenesses.add(round.position.availableMoves[availableMove].remoteness);
                }
            }
        }
    }
    return Math.max(...remotenesses);
};

/** 
 * Determines the maximum Win By value between rounds payload.from to payload.to. If there is no Win By value greater
 * than the threshold of 5, then returns the threshold.
 * @param {Types.App} app - App.
 * @param {number} payload.from - round id to start calculating the maximum Win By value.
 * @param {number} payload.to - round id to end calculating the maximum Win By value.
 * @returns the maximum Win By value when it is greater than the threshold, else returns the threshold.
*/
export const getMaximumWinBy = (app: Types.App, payload: { from: number; to: number }) => {
    const winbys = new Set<number>();
    winbys.add(5); // In case all involved positions are draw, 5 shall be the default maximum winby
    for (let roundId = payload.from; roundId <= payload.to; roundId++) {
        const round = app.currentMatch.rounds[roundId];
        if (round.position.positionValue !== "draw") winbys.add(round.position.winby);
        if (app.options.showNextMoves) {
            for (const availableMove in round.position.availableMoves) {
                if (round.position.availableMoves[availableMove].positionValue !== "draw") {
                    winbys.add(round.position.availableMoves[availableMove].winby);
                }
            }
        }
    }
    return Math.max(...winbys);
};

export const isEndOfMatch = (app: Types.App) =>
    !app.currentMatch.round.position.remoteness ||
    !Object.keys(app.currentMatch.round.position.availableMoves).length;

export const exitMatch = (app: Types.App) => {
    if (app.currentMatch.rounds.length > 2) { 
        app.currentMatch.lastPlayed = new Date().getTime();
        app.currentMatch.rounds[app.currentMatch.round.id] = deepcopy(app.currentMatch.round);
        app.matches[app.currentMatch.id] = deepcopy(app.currentMatch);
    }
    app.currentMatch = deepcopy(Defaults.defaultMatch);
    return app;
};

/** 
 * Determines the CPU player's next move. If the CPU strategy is set to 'Remoteness' and the CPU player is winning on the current position, returns
 * the move with the lowest remoteness value; if there are multiple moves with the lowest remoteness value and the current game supports win by, returns 
 * the move with the highest win by value. If the CPU player is loosing on the current position, returns the move with the highest remoteness value; if 
 * there are multiple moves with the highest remoteness value, then returns the move with the lowest win by value. If the CPU strategy is set to 'Win By'
 * and the CPU player is winning on the current position, returns the move with the highest win by value; if there are multiple moves with the highest win 
 * by value, returns the move with the lowest remoteness value. If the CPU player is loosing on the current position, returns the move with the lowest win 
 * by value; if there are multiple moves with the lowest win by value, returns the move with the highest remoteness.
 * @param {Types.Round} round - current round.
 * @returns CPU player's next move.
*/
export const generateComputerMove = (round: Types.Round) => {
    const store = useStore();
    const currentPlayerTurn = store.getters.currentValuedRounds[round.id].firstPlayerTurn ? 1 : 2;
    const CPUStrategy = store.getters.currentCPUStrategy(currentPlayerTurn - 1);
    const gameType = store.getters.currentGameType;
    const gameId = store.getters.currentGameId;
    const supportsWinBy = store.getters.supportsWinBy(gameType, gameId);
    const availableMoves = Object.values(round.position.availableMoves);
    const currentPositionValue = round.position.positionValue;

    let bestMoves = availableMoves.filter((availableMove) => availableMove.moveValue === currentPositionValue || currentPositionValue === "unsolved");
    
    if (CPUStrategy === "Remoteness") {
        if (currentPositionValue === "win" || currentPositionValue === "tie") {
            const minimumRemoteness = Math.min(...bestMoves.map((bestMove) => bestMove.remoteness));
            bestMoves = bestMoves.filter((availableMove) => availableMove.remoteness === minimumRemoteness);
            
            if (supportsWinBy) {
                const maximumWinBy = Math.max(...bestMoves.map((bestMove) => bestMove.winby));
                bestMoves = bestMoves.filter((availableMove) => availableMove.winby === maximumWinBy);
            }
        } else if (currentPositionValue === "lose") {
            const maximumRemoteness = Math.max(...bestMoves.map((bestMove) => bestMove.remoteness));
            bestMoves = bestMoves.filter((availableMove) => availableMove.remoteness === maximumRemoteness);

            if (supportsWinBy) {
                const minimumWinBy = Math.min(...bestMoves.map((bestMove) => bestMove.winby));
                bestMoves = bestMoves.filter((availableMove) => availableMove.winby === minimumWinBy);
            }
        }
    } else if (CPUStrategy === "Win By"){
        if (currentPositionValue === "win" || currentPositionValue === "tie") {
            const maximumWinBy = Math.max(...bestMoves.map((bestMove) => bestMove.winby));
            bestMoves = bestMoves.filter((availableMove) => availableMove.winby === maximumWinBy);

            const minimumRemoteness = Math.min(...bestMoves.map((bestMove) => bestMove.remoteness));
            bestMoves = bestMoves.filter((availableMove) => availableMove.remoteness === minimumRemoteness);
        } else if (currentPositionValue === "lose") {
            const minimumWinBy = Math.min(...bestMoves.map((bestMove) => bestMove.winby));
            bestMoves = bestMoves.filter((availableMove) => availableMove.winby === minimumWinBy);

            const maximumRemoteness = Math.max(...bestMoves.map((bestMove) => bestMove.remoteness));
            bestMoves = bestMoves.filter((availableMove) => availableMove.remoteness === maximumRemoteness);
        }
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
};

export const runMove = async (app: Types.App, payload: { move: string }) => {
    app.currentMatch.round.move = payload.move;
    const moveObj = app.currentMatch.round.position.availableMoves[payload.move];
    const animationDuration = handleMoveAnimation(app.preferences.volume, app.currentMatch, moveObj);
    if (animationDuration != 0) {
        app.currentMatch.animationPlaying = true;
    }
    app.currentMatch.round.moveValue = moveObj.moveValue;
    app.currentMatch.round.moveName = moveObj.moveName !== undefined ? moveObj.moveName : moveObj.move;

    // Rewrite history by deleting all subsequent moves made earlier.
    app.currentMatch.rounds.splice(
        app.currentMatch.round.id, 
        app.currentMatch.rounds.length - app.currentMatch.round.id
    );
    app.currentMatch.rounds.push(deepcopy(app.currentMatch.round));
    var updatedApp = null;
    for (var attempts = 0; attempts < 5; attempts++) {
        updatedApp = await loadPosition(app, {
            gameType: app.currentMatch.gameType,
            gameId: app.currentMatch.gameId,
            variantId: app.currentMatch.variantId,
            position: moveObj.position
        });
        if (updatedApp) break;
    }
    await new Promise(r => setTimeout(r, animationDuration));
    app.currentMatch.animationPlaying = false;
    animationEpilogue(app.currentMatch);
    if (!updatedApp) {
        alert("Failed to load next position after 5 attempts. Resetting to previous position.");
        return app;
    }

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
    app.currentMatch.moveHistory += moveHistoryDelim + (moveObj.moveName ? moveObj.moveName : moveObj.move);
    let posArr = updatedPosition.position.split('_');
    if (posArr.length === 5 && posArr[0] === 'R') {
        app.currentMatch.round.firstPlayerTurn = posArr[1] === 'A'
    } else if (app.currentMatch.gameType === "puzzles") {
        app.currentMatch.round.firstPlayerTurn = true;
    } else {
        app.currentMatch.round.firstPlayerTurn = !app.currentMatch.round.firstPlayerTurn;
    }
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.lastPlayed = new Date().getTime();
    app.currentMatch.round.id += 1;
    app.currentMatch.round.position = updatedPosition;
    app.currentMatch.rounds.push(deepcopy(app.currentMatch.round));
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
};

const undoRedoAvailable = (app: Types.App, roundOffset: number) => {
    const firstPlayerIsComputer = app.currentMatch.firstPlayer.isComputer;
    const secondPlayerIsComputer = app.currentMatch.secondPlayer.isComputer;
    if (firstPlayerIsComputer && secondPlayerIsComputer) {
        /* Undo/redo move is always disabled in CVC mode. */
        return false;
    }
    const maxRoundId = app.currentMatch.rounds.length - 1;
    for (let i = app.currentMatch.round.id + roundOffset;
         i >= 1 && i <= maxRoundId;
         i += roundOffset
    ) {
        const firstPlayerTurn = app.currentMatch.rounds[i].firstPlayerTurn;
        if (firstPlayerTurn && !firstPlayerIsComputer ||
            !firstPlayerTurn && !secondPlayerIsComputer) {
            /* Round i is the turn we wish to go to. */
            return true;
        }
    }
    return false;
};

const gotoRoundId = (app: Types.App, roundId: number) => {
    app.currentMatch.round = deepcopy(app.currentMatch.rounds[roundId]);
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.lastPlayed = new Date().getTime();
    return app;
};

export const redoMoveAvailable = (app: Types.App) => {
    return undoRedoAvailable(app, 1);
};

export const redoMove = (app: Types.App) => {
    /* Redo the next human action in history. */
    const currRoundId = app.currentMatch.round.id;
    const maxRoundId = app.currentMatch.rounds.length - 1;
    let toRoundId = currRoundId; // Placeholder value to satisfy analyzer.
    const firstPlayerIsComputer = app.currentMatch.firstPlayer.isComputer;
    const secondPlayerIsComputer = app.currentMatch.secondPlayer.isComputer;

    for (let i = currRoundId + 1; i <= maxRoundId; ++i) {
        const firstPlayerTurn = app.currentMatch.rounds[i].firstPlayerTurn;
        if (firstPlayerTurn && !firstPlayerIsComputer ||
            !firstPlayerTurn && !secondPlayerIsComputer) {
            /* Round i is the turn we wish to return to. */
            toRoundId = i;
            break;
        }
    }
    // Modify move history before changing current round id.
    for (let i = currRoundId; i < toRoundId; ++i) {
        app.currentMatch.moveHistory += moveHistoryDelim + (
            app.currentMatch.rounds[i].moveName ?
            app.currentMatch.rounds[i].moveName :
            app.currentMatch.rounds[i].move
        );
    }
    return gotoRoundId(app, toRoundId);
};

export const undoMoveAvailable = (app: Types.App) => {
    return undoRedoAvailable(app, -1);
};

export const undoMove = (app: Types.App, payload?: { toRoundId?: number }) => {
    const currRoundId = app.currentMatch.round.id;
    let toRoundId = currRoundId; // Placeholder value to satisfy analyzer.
    if (payload && payload.toRoundId) {
        /* Undo to the given roundId if possible. */
        if (payload.toRoundId < 1 || payload.toRoundId >= currRoundId) {
            return app;
        }
        toRoundId = payload.toRoundId;
    } else {
        /* Undo the previous human action. */
        const firstPlayerIsComputer = app.currentMatch.firstPlayer.isComputer;
        const secondPlayerIsComputer = app.currentMatch.secondPlayer.isComputer;
        for (let i = currRoundId - 1; i >= 1; --i) {
            const firstPlayerTurn = app.currentMatch.rounds[i].firstPlayerTurn;
            if (firstPlayerTurn && !firstPlayerIsComputer ||
                !firstPlayerTurn && !secondPlayerIsComputer) {
                /* Round i is the turn we wish to return to. */
                toRoundId = i;
                break;
            }
        }
    }
    app.currentMatch.moveHistory = popMovesFromHistory(
        app.currentMatch.moveHistory,
        currRoundId - toRoundId
    );
    return gotoRoundId(app, toRoundId);
};

export const updateGameTheme = (app: Types.App, payload: { gameTheme : string }) => {
    app.currentMatch.gameTheme = payload.gameTheme;
    return app;
};

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
};

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
};
