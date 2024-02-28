import * as GCTAPI from "../apis/gamesCrafters";
import * as GCTAPITypes from "../apis/gamesCrafters/types";
import * as GHAPI from "../apis/gitHub";
import type * as Types from "./types";
import * as Defaults from "../../models/datas/defaultApp";
import { handleMoveAnimation, animationEpilogue } from "./moveAnimation"
import { playGameAmbience, pauseAllGameSounds } from "./audio"
import { useStore } from "../plugins/store";
export const moveHistoryDelim = ':';

const deepcopy = (obj: Object) => {
    return JSON.parse(JSON.stringify(obj));
};

export const loadGames = async (app: Types.App) => {
    if (Object.keys(app.games).length == 0) {
        const games = await GCTAPI.loadGames(app.dataSources.gameAPI);
        if (!games) return undefined;
        for (const game of games) {
            app.games[game.id] = {
                ...Defaults.defaultGame,
                id: game.id,
                name: game.name,
                type: game.type,
                gui: game.gui,
                variants: {},
            };
        }
    }
    return app;
};

export const addInstructions = async (app: Types.App, payload: {gameId: string, variantId: string}) => {
    const instructions = await GCTAPI.loadInstructions(`${app.dataSources.gameAPI}${app.currentMatch.gameId}/${app.currentMatch.variantId}/instructions/?locale=${app.preferences.locale}`);
    app.games[payload.gameId].instructions[app.preferences.locale] = instructions ? instructions.instructions : "";
    return app;
}

export const loadGame = async (app: Types.App, payload: { gameId: string; force?: boolean }) => {
    if (!Object.keys(app.games).length) {
        const updatedApp = await loadGames(app);
        if (!updatedApp) return undefined;
    }
    const game = await GCTAPI.loadGame(`${app.dataSources.gameAPI}${payload.gameId}/`);
    if (!game) return undefined;
    app.games[payload.gameId].instructions = {};
    app.games[payload.gameId].allowCustomVariantCreation = game.allowCustomVariantCreation;
    app.games[payload.gameId].variants = {};
    app.games[payload.gameId].supportsWinBy = game.supportsWinBy;
    for (const variant of game.variants) {
        app.games[payload.gameId].variants[variant.id] = {
            id: variant.id,
            name: variant.name,
            gui: variant.gui,
            startPosition: '',
            autoguiStartPosition: '',
            imageAutoGUIData: {} as GCTAPITypes.ImageAutoGUIData,
            positions: {},
        };
    }
    return app;
};

const loadVariant = async (app: Types.App, payload: { gameId: string; variantId: string; force?: boolean }) => {
    const variant = await GCTAPI.loadVariant(`${app.dataSources.gameAPI}${payload.gameId}/${payload.variantId}/`);
    if (!variant) return Defaults.defaultVariant;

    return {
        id: variant.id,
        name: variant.name,
        gui: variant.gui,
        startPosition: variant.startPosition,
        autoguiStartPosition: variant.autoguiStartPosition,
        imageAutoGUIData: variant.imageAutoGUIData,
        positions: {},
    };
};

const loadPosition = async (app: Types.App, payload: { gameId: string; variantId: string; position: string; force?: boolean }) => {
    const positions = app.games[payload.gameId].variants[payload.variantId].positions;
    const updatedPosition = await GCTAPI.loadPosition(`${app.dataSources.gameAPI}${payload.gameId}/${payload.variantId}/positions/?p=${payload.position}`);
    if (!updatedPosition) {
        return undefined;
    }
    positions[payload.position] = {
        position: updatedPosition.position,
        autoguiPosition: updatedPosition.autoguiPosition,
        availableMoves: createAutoguiMoveToMoveObject(updatedPosition.moves),
        moveToAutoguiMove: createMoveToAutoguiMove(updatedPosition.moves),
        positionValue: updatedPosition.positionValue,
        remoteness: updatedPosition.remoteness,
        winby: updatedPosition.winby,
        mex: updatedPosition["mex"] || "",
        drawLevel: "drawLevel" in updatedPosition ? updatedPosition["drawLevel"] : -1,
        drawRemoteness: "drawRemoteness" in updatedPosition ? updatedPosition["drawRemoteness"] : -1
    };
    return app;
};

export const initiateMatch = async (app: Types.App, payload: {
    gameId: string;
    variantId: string;
    startPosition?: string;
    firstPlayerIsComputer?: boolean;
    secondPlayerIsComputer?: boolean;
}) => {
    const cachedGames = app.games;
    if (!Object.keys(cachedGames).length || !Object.keys(cachedGames[payload.gameId].variants).length) {
        /* Load available variants if not found in cache. */
        const updatedApp = await loadGame(app, payload);
        if (!updatedApp) return undefined;
    }

    const game = cachedGames[payload.gameId];
    const variant = await loadVariant(app, payload);
    game.variants[payload.variantId] = variant;

    const startPosition = (payload.startPosition && payload.startPosition !== 'random') ? payload.startPosition : variant.startPosition;

    const updatedApp = await loadPosition(app, { ...payload, position: startPosition });
    if (!updatedApp) return undefined;

    if (!game.supportsWinBy) app.CPUsStrategies = [...Defaults.defaultCPUsStrategies];
    app.currentMatch.gameTheme = variant.imageAutoGUIData ? variant.imageAutoGUIData.defaultTheme : "";
    app.currentMatch.startPosition = startPosition;
    app.currentMatch.moveHistory = game.name + moveHistoryDelim + startPosition;
    app.currentMatch.gameType = game.type === "onePlayer" ? "puzzles" : "games";
    app.currentMatch.gameId = payload.gameId;
    app.currentMatch.variantId = payload.variantId;
    app.currentMatch.id = generateMatchId(app);
    if (!(payload.firstPlayerIsComputer === undefined)) app.currentMatch.firstPlayer.isComputer = payload.firstPlayerIsComputer;
    if (!(payload.secondPlayerIsComputer === undefined)) app.currentMatch.secondPlayer.isComputer = payload.secondPlayerIsComputer;
    
    const autoguiStartPosition = app.games[payload.gameId].variants[payload.variantId].positions[startPosition].autoguiPosition;
    app.currentMatch.round = {
        id: 1,
        firstPlayerTurn: autoguiStartPosition.charAt(0) != '2',
        move: "",
        autoguiMove: "",
        moveValue: "",
        position: deepcopy(variant.positions[startPosition]),
    };
    app.currentMatch.rounds = [
        deepcopy(Defaults.defaultRound),
        deepcopy(app.currentMatch.round)
    ];
    playGameAmbience();

    if (payload.startPosition !== 'random') {
        await addInstructions(app, payload);
    }
    return app;
};

/**
 * @param moves An array of move objects.
 * @returns A dictionary such that each move object in the original
 * input array is a key/value pair (key: moveObj.move, value: moveObj.autoguiMove).
 * This dictionary is used when processing a user-entered move history. 
 */
const createMoveToAutoguiMove = (moves: Array<GCTAPITypes.Move>) => {
    const target: Types.MoveNames = { ...Defaults.defaultMoveToAutoguiMove };
    for (const move in moves) {
        target[moves[move].move] = moves[move].autoguiMove;
    }
    return target;
};

/** 
 * The input `moves` contains all legal moves from the current position,
 * as an array of move objects sorted from best to worst according to 
 * value and remoteness.
 * 
 * This function will take each move object and put it in a dictionary
 * with its autoguiMove as the key and itself as the value.
 * We also add a `moveValueOpacity` field for each move object.
 * It will then return the dictionary. 
 * 
 * As a reminder, value/remoteness tuples are listed from best to worst as follows:
 *   Low-Remoteness Win, High-Remoteness Win, Low-Remoteness Tie, High-Remoteness Tie, 
 *   Draw, High-Remoteness Lose, Lower Remoteness Lose
 * 
 * `moves` contains moves of various moveValues from the set {win, tie, draw, lose}
 * However, for this function, we treat tie/draw as the same moveValue, so a
 * draw is just a tie in infinity.
 * 
 * For a particular set of moves in `moves` that have a particular moveValue:
 * - The move(s) with the best remoteness will have an opacity of 1.
 * - The move(s) with the second best remoteness will have an opacity of 0.75.
 * - The move(s) with the third best remoteness will have an opacity of 0.5.
 * - All other moves will have an opacity of 0.25.
*/
const createAutoguiMoveToMoveObject = (moves: Array<GCTAPITypes.Move>) => {
    const formattedMoves: Types.Moves = {};
    if (moves.length) {
        formattedMoves[moves[0].autoguiMove] = { ...moves[0], moveValueOpacity: 1 };
    }
    for (let i = 1; i < moves.length; i++) {
        if (!(moves[i].autoguiMove in formattedMoves)) {
            formattedMoves[moves[i].autoguiMove] = { ...moves[i], moveValueOpacity: 1 };
        }
        const previousMove = formattedMoves[moves[i - 1].autoguiMove];
        const currentMove = formattedMoves[moves[i].autoguiMove];
        if ((previousMove.moveValue === currentMove.moveValue) || (previousMove.moveValue === 'tie' && currentMove.moveValue === 'draw')) {
            if (previousMove.moveValueOpacity < 0.5 || previousMove.deltaRemoteness == currentMove.deltaRemoteness) {
                currentMove.moveValueOpacity = previousMove.moveValueOpacity;
            } else {
                currentMove.moveValueOpacity = previousMove.moveValueOpacity - 0.25;
            }
        }
    }
    return formattedMoves;
};

export const preFetchNextPositions = async (app: Types.App, payload: { gameType: string; gameId: string; variantId: string; position: string }) => {
    const positions = app.games[payload.gameId].variants[payload.variantId].positions;
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

export const restartMatch = async (app: Types.App) => {
    const gameId = app.currentMatch.gameId;
    const variantId = app.currentMatch.variantId
    const game = app.games[gameId];
    const startPosition = app.currentMatch.startPosition;

    /* Reset round id to 1 and delete all existing rounds. */
    const autoguiStartPosition = app.games[gameId].variants[variantId].positions[startPosition].autoguiPosition;

    app.currentMatch.round = {
        id: 1,
        firstPlayerTurn: autoguiStartPosition.charAt(0) == '1',
        move: "",
        autoguiMove: "",
        moveValue: "",
        position: deepcopy(game.variants[variantId].positions[startPosition])
    };
    app.currentMatch.round.move = "";
    app.currentMatch.round.autoguiMove = "";
    app.currentMatch.round.moveValue = "";
    app.currentMatch.rounds = [
        deepcopy(Defaults.defaultRound),
        deepcopy(app.currentMatch.round)
    ];
    app.currentMatch.moveHistory = game.name + moveHistoryDelim + startPosition;
    return app;
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
    remotenesses.add(0); // In case all involved positions are draw or have finite unknown remotenesses, 0 shall be the default maximum remoteness.
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
    app.currentMatch.round.position.remoteness == 0 ||
    !Object.keys(app.currentMatch.round.position.availableMoves).length;

export const exitMatch = (app: Types.App) => {
    pauseAllGameSounds();
    if (app.currentMatch.rounds.length > 2) { 
        app.currentMatch.rounds[app.currentMatch.round.id] = deepcopy(app.currentMatch.round);
        app.matches[app.currentMatch.id] = deepcopy(app.currentMatch);
    }
    app.currentMatch = deepcopy(Defaults.defaultMatch);
    return app;
};

/** 
 * Determines the CPU player's next move based if the CPU strategy is set to 'Remoteness', 'Win By', or 'Skill Expression'.
 * @param {Types.Round} round - current round.
 * @returns CPU player's next move.
*/
export const generateComputerMove = (round: Types.Round) => {
    const store = useStore();
    const currentPlayerTurn = store.getters.currentValuedRounds[round.id].firstPlayerTurn ? 1 : 2;
    const CPUStrategy = store.getters.currentCPUStrategy(currentPlayerTurn - 1);
    
    
    switch(CPUStrategy) {
        case "Remoteness":
            return generateComputerMoveByRemoteness(round);
            break;
        case "Win By":
            return generateComputerMoveByWinBy(round);
            break;
        case "Skill Expression":
            return generateComputerMoveBySkillExpression(round);
            break;
    }
    
    console.error("noSuchCPUStrategy.");
    return "";
};

/**
 * If the CPU player is winning on the current position, returns the move  with the lowest remoteness value; if there are 
 * multiple moves with the lowest remoteness value and the current game supports win by, returns the move with the highest 
 * win by value. If the CPU player is losing on the current position, returns the move with the highest remoteness value; 
 * if  there are multiple moves with the highest remoteness value, then returns the move with the lowest win by value. If the 
 * current position is a known pure draw: if the current position is a draw-win, then return the lowest-draw-remoteness 
 * same-draw-level draw-win move; else return the highest-draw-remoteness same-draw-level draw-lose move.
 * @param {Types.Round} round - current round.
 * @returns CPU player's next move.
 */
const generateComputerMoveByRemoteness = (round: Types.Round) => {
    const store = useStore();

    const gameId = store.getters.currentGameId;
    const currentPositionValue = round.position.positionValue;

    const supportsWinBy = store.getters.supportsWinBy(gameId);

    const availableMoves = Object.values(round.position.availableMoves);
    let bestMoves = availableMoves.filter((availableMove) => availableMove.moveValue === currentPositionValue || currentPositionValue === "unsolved");

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
    } else if (currentPositionValue === "draw" && round.position.drawLevel != -1) { // If current position is a known pure draw
        var isDrawWin = round.position.drawRemoteness & 1; // Bit indicating whether current position is a draw-win
        bestMoves = bestMoves.filter((availableMove) => availableMove.drawLevel === round.position.drawLevel && isDrawWin != (availableMove.drawRemoteness & 1));
        var desiredRemoteness = (isDrawWin ? Math.min : Math.max)(...bestMoves.map((bestMove) => bestMove.drawRemoteness));
        bestMoves = bestMoves.filter((availableMove) => availableMove.drawRemoteness === desiredRemoteness);
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
}

/**
 * If the CPU player is winning on the current position, returns the move with the highest win by value; if there are 
 * multiple moves with the highest win by value, returns the move with the lowest remoteness value. If the CPU player 
 * is losing on the current position, returns the move with the lowest win  by value; if there are multiple moves with 
 * the lowest win by value, returns the move with the highest remoteness. If the 
 * current position is a known pure draw: if the current position is a draw-win, then return the lowest-draw-remoteness 
 * same-draw-level draw-win move; else return the highest-draw-remoteness same-draw-level draw-lose move.
 * @param {Types.Round} round - current round.
 * @returns CPU player's next move.
 */
const generateComputerMoveByWinBy = (round: Types.Round) => {
    const currentPositionValue = round.position.positionValue;

    const availableMoves = Object.values(round.position.availableMoves);
    let bestMoves = availableMoves.filter((availableMove) => availableMove.moveValue === currentPositionValue || currentPositionValue === "unsolved");

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
    } else if (currentPositionValue === "draw" && round.position.drawLevel != -1) { // If current position is a known pure draw
        var isDrawWin = round.position.drawRemoteness & 1; // Bit indicating whether current position is a draw-win
        bestMoves = bestMoves.filter((availableMove) => availableMove.drawLevel === round.position.drawLevel && isDrawWin != (availableMove.drawRemoteness & 1));
        var desiredRemoteness = (isDrawWin ? Math.min : Math.max)(...bestMoves.map((bestMove) => bestMove.drawRemoteness));
        bestMoves = bestMoves.filter((availableMove) => availableMove.drawRemoteness === desiredRemoteness);
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
}

/**
 * WIP
 * @param round - current round.
 * @returns CPU player's next move.
 */
const generateComputerMoveBySkillExpression = (round: Types.Round) => {
    const store = useStore();

    const gameId = store.getters.currentGameId;
    const currentPositionValue = round.position.positionValue;
    const currentPlayerTurn = store.getters.currentValuedRounds[round.id].firstPlayerTurn ? 1 : 2;

    const supportsWinBy = store.getters.supportsWinBy(gameId);
    const CPUSkillRating = store.getters.currentCPUsRatings[currentPlayerTurn - 1];
    const availableMoves = Object.values(round.position.availableMoves);

    if(Math.random() < CPUSkillRating) {
        return generateComputerMoveByRemoteness(round);
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)].move;
}

export const runMove = async (app: Types.App, payload: { autoguiMove: string }) => {
    app.currentMatch.round.autoguiMove = payload.autoguiMove;
    const moveObj = app.currentMatch.round.position.availableMoves[payload.autoguiMove];
    const animationDuration = handleMoveAnimation(app.preferences.volume, app.currentMatch, moveObj);
    if (animationDuration > 0) {
        app.currentMatch.animationPlaying = true;
    }
    app.currentMatch.round.moveValue = moveObj.moveValue;
    app.currentMatch.round.move = moveObj.move;

    // Rewrite history by deleting all subsequent moves made earlier.
    app.currentMatch.rounds.splice(
        app.currentMatch.round.id, 
        app.currentMatch.rounds.length - app.currentMatch.round.id
    );
    app.currentMatch.rounds.push(deepcopy(app.currentMatch.round));
    var updatedApp = null;
    for (var attempts = 0; attempts < 5; attempts++) {
        updatedApp = await loadPosition(app, {
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
        ...updatedApp
        .games[app.currentMatch.gameId]
        .variants[app.currentMatch.variantId].
        positions[
            app.
            currentMatch.
            round.
            position.
            availableMoves[payload.autoguiMove].
            position
        ]
    };
    app.currentMatch.moveHistory += moveHistoryDelim + moveObj.move;
    let autoguiPosition = updatedPosition.autoguiPosition;
    if ((autoguiPosition.charAt(0) == '1' || autoguiPosition.charAt(0) == '2') && autoguiPosition.charAt(1) == '_') { // in proper autogui format
        app.currentMatch.round.firstPlayerTurn = autoguiPosition.charAt(0) == '1';
    } else if (app.currentMatch.gameType === "puzzles") {
        app.currentMatch.round.firstPlayerTurn = true;
    } else { // not in proper autogui format
        app.currentMatch.round.firstPlayerTurn = !app.currentMatch.round.firstPlayerTurn;
    }
    app.currentMatch.round.autoguiMove = "";
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
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
    app.currentMatch.round.autoguiMove = "";
    app.currentMatch.round.move = "";
    app.currentMatch.round.moveValue = "";
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
        app.currentMatch.moveHistory += moveHistoryDelim + app.currentMatch.rounds[i].move;
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
    // // Check if position is valid
    payload.position = payload.position.replace(/(\r\n|\n|\r)/gm, "");
    const updatedApp = await loadPosition(app, {
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