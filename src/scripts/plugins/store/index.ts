import * as Vuex from "vuex";
import * as Defaults from "../../../models/datas/defaultApp";
import { ImageAutoGUIData } from "../../apis/gamesCrafters/types";
import * as GMU from "../../gamesmanUni";
import * as GMUTypes from "../../gamesmanUni/types";

export type State = { app: GMUTypes.App };

const state: State = { app: Defaults.defaultApp };

/* Prefetching is currently turned off under all circumstances. */
const preFetchEnabled: boolean = false;

type Getters = {
    animationPlaying(state: State): boolean;
    availableMove(state: State):
        (gameType: string, gameId: string, variantId: string, position: string, move: string) =>
            GMUTypes.Move;
    availableMoves(state: State):
        (gameType: string, gameId: string, variantId: string, position: string) =>
            GMUTypes.Moves;
    backgroundLoading(state: State): boolean;
    commit(state: State): (sha: string) => GMUTypes.Commit;
    commits(state: State): GMUTypes.Commits;
    computerMoving(state: State): boolean;
    currentAvailableMove(state: State): (move: string) => GMUTypes.Move;
    currentAvailableMoves(state: State): GMUTypes.Moves;
    currentGameId(state: State): string;
    currentGameName(state: State): string;
    currentGameTheme(state: State): string;
    currentGameType(state: State): string;
    currentLeftPlayer(state: State): GMUTypes.Player;
    currentMatch(state: State): GMUTypes.Match;
    currentMatchId(state: State): number;
    currentMove(state: State): string;
    currentMoveValue(state: State): string;
    currentPlayer(state: State): GMUTypes.Player;
    currentPosition(state: State): string;
    currentPositionMex(state: State): string;
    currentPositionValue(state: State): string;
    currentRemoteness(state: State): number;
    currentRightPlayer(state: State): GMUTypes.Player;
    currentRound(state: State): (roundId?: number) => GMUTypes.Round;
    currentRoundId(state: State): number;
    currentRounds(state: State): GMUTypes.Rounds;
    currentStartPosition(state: State): string;
    currentValuedRounds(state: State): GMUTypes.Rounds;
    currentVariantId(state: State): string;
    dataSources(state: State): GMUTypes.DataSources;
    fallbackLocale(state: State): string;
    game(state: State): (gameType: string, gameId: string) => GMUTypes.Game;
    games(state: State): (gameType: string) => GMUTypes.Games;
    gitHubRepositoryAPI(state: State): string;
    imageAutoGUIData(state: State): 
        (gameType: string, gameId: string, variantId: string) => ImageAutoGUIData;
    isEndOfMatch(state: State): boolean;
    locale(state: State): string;
    maximumRemoteness(state: State): (from: number, to: number) => number;
    moveHistory(state: State): string;
    onePlayerGameAPI(state: State): string;
    position(state: State):
        (gameType: string, gameId: string, variantId: string, position: string) =>
            GMUTypes.Position;
    positions(state: State):
        (gameType: string, gameId: string, variantId: string) => GMUTypes.Positions;
    preferences(state: State): GMUTypes.Preferences;
    redoMoveAvailable(state: State): boolean;
    rootFontSize(state: State): string;
    theme(state: State): string;
    twoPlayerGameAPI(state: State): string;
    options(state: State): GMUTypes.Options;
    undoMoveAvailable(state: State): boolean;
    variant(state: State):
        (gameType: string, gameId: string, variantId: string) =>
            GMUTypes.Variant;
    variants(state: State): (gameType: string, gameId: string) =>
        GMUTypes.Variants;
    version(state: State): string;
    volume(state: State): number;
    supportsWinBy(state: State): number;
};

const getters: Vuex.GetterTree<State, State> & Getters = {
    animationPlaying: (state: State) => state.app.currentMatch.animationPlaying,
    availableMove: (state: State) =>
        (gameType: string, gameId: string, variantId: string, position: string, move: string) =>
            state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].
            positions[position].availableMoves[move],
    availableMoves: (state: State) =>
        (gameType: string, gameId: string, variantId: string, position: string) =>
            state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].
            positions[position].availableMoves,
    backgroundLoading: (state: State) =>
        state.app.currentMatch.backgroundLoading,
    commit: (state: State) => (sha: string) =>
        state.app.commits.commits[sha],
    commits: (state: State) =>
        state.app.commits,
    computerMoving: (state: State) =>
        state.app.currentMatch.computerMoving,
    currentAvailableMove: (state: State) =>
        (move: string) =>
            state.app.currentMatch.round.position.availableMoves[move],
    currentAvailableMoves: (state: State) =>
        state.app.currentMatch.round.position.availableMoves,
    currentGameId: (state: State) =>
        state.app.currentMatch.gameId,
    currentGameName: (state: State) =>
        state.app.gameTypes[state.app.currentMatch.gameType].games[state.app.currentMatch.gameId].name,
    currentGameTheme: (state: State) =>
        state.app.currentMatch.gameTheme,
    currentGameType: (state: State) =>
        state.app.currentMatch.gameType,
    currentLeftPlayer: (state: State) =>
        state.app.currentMatch.firstPlayer,
    currentMatch: (state: State) =>
        state.app.currentMatch,
    currentMatchId: (state: State) =>
        state.app.currentMatch.id,
    currentMove: (state: State) =>
        state.app.currentMatch.round.move,
    currentMoveValue: (state: State) =>
        state.app.currentMatch.round.moveValue,
    currentPlayer: (state: State) =>
        state.app.currentMatch.round.firstPlayerTurn ?
            state.app.currentMatch.firstPlayer :
            state.app.currentMatch.secondPlayer,
    currentPosition: (state: State) =>
        state.app.currentMatch.round.position.position,
    currentPositionMex: (state: State) =>
        state.app.currentMatch.round.position.mex,
    currentPositionValue: (state: State) =>
        state.app.currentMatch.round.position.positionValue,
    currentRemoteness: (state: State) =>
        state.app.currentMatch.round.position.remoteness,
    currentRightPlayer: (state: State) =>
        state.app.currentMatch.secondPlayer,
    currentRound: (state: State) =>
        (roundId?: number) =>
            roundId ?
                state.app.currentMatch.rounds[roundId] :
                state.app.currentMatch.round,
    currentRoundId: (state: State) =>
        state.app.currentMatch.round.id,
    currentRounds: (state: State) =>
        state.app.currentMatch.rounds,
    currentStartPosition: (state: State) =>
        state.app.currentMatch.startPosition,
    currentVariantId: (state: State) =>
        state.app.currentMatch.variantId,
    currentValuedRounds: (state: State) =>
        state.app.currentMatch.rounds.filter(round => round.position.positionValue !== "unsolved"),
    dataSources: (state: State) =>
        state.app.dataSources,
    fallbackLocale: (state: State) =>
        state.app.preferences.fallbackLocale,
    game: (state: State) =>
        (gameType: string, gameId: string) =>
            state.app.gameTypes[gameType].games[gameId],
    games: (state: State) =>
        (gameType: string) =>
            state.app.gameTypes[gameType],
    gitHubRepositoryAPI: (state: State) =>
        state.app.dataSources.gitHubRepositoryAPI,
    imageAutoGUIData: (state: State)  =>
        (gameType: string, gameId: string, variantId: string) =>
            state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].imageAutoGUIData,
    isEndOfMatch: (state: State) =>
        GMU.isEndOfMatch(state.app),
    locale: (state: State) =>
        state.app.preferences.locale,
    maximumRemoteness: (state: State) =>
        (from: number, to: number) =>
            GMU.getMaximumRemoteness(state.app, { from, to }),
    moveHistory: (state: State) =>
        state.app.currentMatch.moveHistory,
    onePlayerGameAPI: (state: State) =>
        state.app.dataSources.onePlayerGameAPI,
    position: (state: State) =>
        (gameType: string, gameId: string, variantId: string, position: string) =>
            state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].
            positions[position],
    positions: (state: State) =>
        (gameType: string, gameId: string, variantId: string) =>
            state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].
            positions,
    preferences: (state: State) =>
        state.app.preferences,
    redoMoveAvailable: (state: State) =>
        GMU.redoMoveAvailable(state.app),
    rootFontSize: (state: State) =>
        state.app.preferences.rootFontSize,
    theme: (state: State) =>
        state.app.preferences.theme,
    twoPlayerGameAPI: (state: State) =>
        state.app.dataSources.twoPlayerGameAPI,
    options: (state: State) =>
        state.app.options,
    undoMoveAvailable: (state: State) =>
        GMU.undoMoveAvailable(state.app),
    variant: (state: State) =>
        (gameType: string, gameId: string, variantId: string) =>
            state.app.gameTypes[gameType].games[gameId].variants.variants[variantId],
    variants: (state: State) =>
        (gameType: string, gameId: string) =>
            state.app.gameTypes[gameType].games[gameId].variants,
    version: (state: State) =>
        state.app.version,
    volume: (state: State) =>
        state.app.preferences.volume,
    supportsWinBy: (state: State) =>
        state.app.gameTypes[state.app.currentMatch.gameType].games[state.app.currentMatch.gameId].supportsWinBy,
};

export enum mutationTypes {
    setApp = "setApp",
    setCurrentLeftPlayerName = "setCurrentLeftPlayerName",
    setCurrentRightPlayerName = "setCurrentRightPlayerName",
    setGameTheme = "setGameTheme",
    setLeftPlayerIsComputer = "setLeftPlayerIsComputer",
    setRightPlayerIsComputer = "setRightPlayerIsComputer",
    setLocale = "setLocale",
    setOptions = "setOptions",
    setRootFontSize = "setRootFontSize",
    setTheme = "setTheme",
    showInstructions = "showInstructions",
    showOptions = "showOptions",
    showVvhGuides = "showVvhGuides",
    showVvhMeters = "showVvhMeters",
    toggleVvhScrolling = "toggleVvhScrolling",

    setVvhView = "setVvhView"
}

type Mutations = {
    [mutationTypes.setApp](state: State, app: GMUTypes.App): void;
    [mutationTypes.setCurrentLeftPlayerName](state: State, leftPlayerName: string): void;
    [mutationTypes.setCurrentRightPlayerName](state: State, rightPlayerName: string): void;
    [mutationTypes.setGameTheme](state: State, gameTheme: string): void;
    [mutationTypes.setLeftPlayerIsComputer](state: State, isComputer: boolean): void;
    [mutationTypes.setRightPlayerIsComputer](state: State, isComputer: boolean): void;
    [mutationTypes.setLocale](state: State, locale: string): void;
    [mutationTypes.setOptions](state: State, options: GMUTypes.Options): void;
    [mutationTypes.setRootFontSize](state: State, rootFontSize: string): void;
    [mutationTypes.setTheme](state: State, theme: string): void;
    [mutationTypes.showInstructions](state: State, showInstructions: boolean): void;
    [mutationTypes.showOptions](state: State, showOptions: boolean): void;
    [mutationTypes.showVvhGuides](state: State, showVvhGuides: boolean): void;
    [mutationTypes.showVvhMeters](state: State, showVvhMeters: boolean): void;
    [mutationTypes.toggleVvhScrolling](state: State, vvhScrolling: boolean): void;

    [mutationTypes.setVvhView](state: State, vvhView: string): void;
};

const mutations: Vuex.MutationTree<State> & Mutations = {
    setApp: (state: State, app: GMUTypes.App) =>
        (state.app = app),
    setCurrentLeftPlayerName: (state: State, leftPlayerName: string) =>
        (state.app.currentMatch.firstPlayer.name = leftPlayerName),
    setCurrentRightPlayerName: (state: State, rightPlayerName: string) =>
        (state.app.currentMatch.secondPlayer.name = rightPlayerName),
    setGameTheme: (state: State, gameTheme: string) =>
        state.app.currentMatch.gameTheme = gameTheme,
    setLeftPlayerIsComputer: (state: State, isComputer: boolean) =>
        (state.app.currentMatch.firstPlayer.isComputer = isComputer),
    setRightPlayerIsComputer: (state: State, isComputer: boolean) =>
        (state.app.currentMatch.secondPlayer.isComputer = isComputer),
    setLocale: (state: State, locale: string) =>
        (state.app.preferences.locale = locale ? locale : state.app.preferences.locale),
    setOptions: (state: State, options: GMUTypes.Options) =>
        (state.app.options = options),
    setRootFontSize: (state: State, rootFontSize: string) =>
        (state.app.preferences.rootFontSize = rootFontSize ?
                                                rootFontSize :
                                                state.app.preferences.rootFontSize),
    setTheme: (state: State, theme?: string) =>
        (state.app.preferences.theme = theme ? theme : state.app.preferences.theme),
    showInstructions: (state: State, showInstructions: boolean) =>
        (state.app.options.showInstructions = showInstructions),
    showOptions: (state: State, showOptions: boolean) =>
        (state.app.options.showOptions = showOptions),
    showVvhGuides: (state: State, showVvhGuides: boolean) =>
        (state.app.options.showVvhGuides = showVvhGuides),
    showVvhMeters: (state: State, showVvhMeters: boolean) =>
        (state.app.options.showVvhMeters = showVvhMeters),
    toggleVvhScrolling: (state: State, vvhScrolling: boolean) =>
        (state.app.options.vvhScrolling = vvhScrolling),
    setVvhView: (state: State, vvhView: string) =>
        (state.app.vvhView = vvhView),
};

type ActionContext = Omit<Vuex.ActionContext<State, State>, "commit"> & {
    commit<MutationKeys extends keyof Mutations>(
        key: MutationKeys,
        payload: Parameters<Mutations[MutationKeys]>[1]
    ): ReturnType<Mutations[MutationKeys]>;
};

export enum actionTypes {
    loadGames = "loadGames",
    loadVariants = "loadVariants",
    initiateMatch = "initiateMatch",
    exitMatch = "exitMatch",
    restartMatch = "restartMatch",
    runMove = "runMove",
    runComputerMove = "runComputerMove",
    redoMove = "redoMove",
    undoMove = "undoMove",
    updateGameTheme = "updateGameTheme",
    updateMatchStartPosition = "updateMatchStartPosition",
    preFetchNextPositions = "preFetchNextPositions",
    loadLatestCommits = "loadLatestCommits",
    loadMoveHistory = "loadMoveHistory"
}

type Actions = {
    [actionTypes.loadGames](context: ActionContext, payload: {
        type: string
    }): Promise<void>;
    [actionTypes.loadVariants](context: ActionContext, payload: {
        type: string;
        gameId: string
    }): Promise<void>;
    [actionTypes.initiateMatch](context: ActionContext, payload: {
        gameType: string;
        gameId: string;
        variantId: string;
        startPosition?: string;
        firstPlayerIsComputer?: boolean;
        secondPlayerIsComputer?: boolean;
    }): Promise<void>;
    [actionTypes.exitMatch](context: ActionContext): void;
    [actionTypes.restartMatch](context: ActionContext): Promise<void>;
    [actionTypes.runMove](context: ActionContext, payload: {
        move: string
    }): Promise<void>;
    [actionTypes.runComputerMove](context: ActionContext): Promise<void>;
    [actionTypes.redoMove](context: ActionContext): Promise<void>;
    [actionTypes.undoMove](context: ActionContext, payload?: {
        toRoundId?: number
    }): Promise<void>;
    [actionTypes.updateGameTheme](context: ActionContext, payload: {
        gameTheme : string
    }): void;
    [actionTypes.updateMatchStartPosition](context: ActionContext, payload: {
        position: string
    }): Promise<void | Error>;
    [actionTypes.preFetchNextPositions](context: ActionContext): Promise<void>;
    [actionTypes.loadLatestCommits](context: ActionContext): Promise<void>;
    [actionTypes.loadMoveHistory](context: ActionContext, payload: {
        history: string
    }): Promise<void | Error>;
};

const actions: Vuex.ActionTree<State, State> & Actions = {
    loadGames: async (context: ActionContext, payload: { type: string }) => {
        const updatedApp = await GMU.loadGames(context.state.app, { gameType: payload.type });
        if (updatedApp) context.commit(mutationTypes.setApp, updatedApp);
    },
    loadVariants: async (context: ActionContext, payload: { type: string; gameId: string }) => {
        const updatedApp = await GMU.loadVariants(context.state.app, {
            gameType: payload.type,
            gameId: payload.gameId
        });
        if (updatedApp) context.commit(mutationTypes.setApp, updatedApp);
    },
    initiateMatch: async (context: ActionContext, payload: {
        gameType: string;
        gameId: string;
        variantId: string;
        startPosition?: string;
        firstPlayerIsComputer?: boolean;
        secondPlayerIsComputer?: boolean;
    }) => {
        const updatedApp = await GMU.initiateMatch(context.state.app, payload);
        if (updatedApp) {
            context.commit(mutationTypes.setApp, updatedApp);
            if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
        }
        await store.dispatch(actionTypes.runComputerMove);
    },
    exitMatch: (context: ActionContext) => {
        context.commit(mutationTypes.setApp, GMU.exitMatch(context.state.app));
    },
    restartMatch: async (context: ActionContext) => {
        const updatedApp = await GMU.restartMatch(context.state.app);
        context.commit(mutationTypes.setApp, updatedApp);
        await store.dispatch(actionTypes.runComputerMove);
    },
    runMove: async (context: ActionContext, payload: { move: string }) => {
        context.state.app.currentMatch.computerMoving = true;
        context.state.app.currentMatch.backgroundLoading = true;
        const updatedApp = await GMU.runMove(context.state.app, payload);
        context.state.app.currentMatch.backgroundLoading = false;
        if (updatedApp) {
            context.commit(mutationTypes.setApp, updatedApp);
            if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
        }
        context.state.app.currentMatch.computerMoving = false;
        await store.dispatch(actionTypes.runComputerMove);
    },
    runComputerMove: async (context: ActionContext) => {
        context.state.app.currentMatch.computerMoving = true;
        /* Keep moving until it becomes a human player's turn or the match is over. */
        while (context.getters.currentPlayer.isComputer && !GMU.isEndOfMatch(context.state.app)) {
            await new Promise((resolve) => setTimeout(resolve, store.getters.options.computerMoveDuration));
            /* If user leaves the game page during timeout, abort. */
            if (!context.state.app.currentMatch.gameType) return;
            context.state.app.currentMatch.backgroundLoading = true;
            const updatedApp = await GMU.runMove(context.state.app, {
                move: GMU.generateComputerMove(context.state.app.currentMatch.round)
            });
            context.state.app.currentMatch.backgroundLoading = false;
            if (updatedApp) {
                context.commit(mutationTypes.setApp, updatedApp);
                if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
            }
        }
        context.state.app.currentMatch.computerMoving = false;
    },
    redoMove: async (context: ActionContext) => {
        context.commit(mutationTypes.setApp, GMU.redoMove(context.state.app));
        if (!context.state.app.currentMatch.rounds[context.state.app.currentMatch.round.id + 1]) {
            if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
        }
        await store.dispatch(actionTypes.runComputerMove);
    },
    undoMove: async (context: ActionContext, payload?: { toRoundId?: number }) => {
        context.commit(mutationTypes.setApp, GMU.undoMove(context.state.app, payload));
        await store.dispatch(actionTypes.runComputerMove);
    },
    updateGameTheme: (context: ActionContext, payload: { gameTheme : string }) => {
        const updatedApp = GMU.updateGameTheme(context.state.app, payload);
        context.commit(mutationTypes.setApp, updatedApp);
    },
    updateMatchStartPosition: async (context: ActionContext, payload: { position: string }) => {
        const updatedAppOrError = await GMU.updateMatchStartPosition(context.state.app, payload);
        if (updatedAppOrError instanceof Error) {
            return updatedAppOrError;
        } else {
            context.commit(mutationTypes.setApp, updatedAppOrError);
            await context.dispatch(actionTypes.restartMatch);
        }
    },
    preFetchNextPositions: async (context: ActionContext) => {
        context.commit(
            mutationTypes.setApp,
            await GMU.preFetchNextPositions(
                context.state.app, {
                    gameType: context.state.app.currentMatch.gameType,
                    gameId: context.state.app.currentMatch.gameId,
                    variantId: context.state.app.currentMatch.variantId,
                    position: context.state.app.currentMatch.round.position.position
                }
            )
        )
    },
    loadLatestCommits: async (context: ActionContext) => {
        const updatedApp = await GMU.loadCommits(context.state.app);
        if (updatedApp) context.commit(mutationTypes.setApp, updatedApp);
    },
    loadMoveHistory: async (context: ActionContext, payload: { history: string }) => {
        const updatedAppOrError = await GMU.loadMoveHistory(context.state.app, payload);
        if (updatedAppOrError instanceof Error) {
            return updatedAppOrError;
        } else {
            context.commit(mutationTypes.setApp, updatedAppOrError);
        }
    }
};

type Store = Omit<Vuex.Store<State>, "getters" | "commit" | "dispatch"> & {
    commit<
        MutationKeysData extends keyof Mutations,
        MutationParametersData extends Parameters<Mutations[MutationKeysData]>[1]
    >(
        key: MutationKeysData,
        payload: MutationParametersData,
        options?: Vuex.CommitOptions
    ): ReturnType<Mutations[MutationKeysData]>;
} & {
    dispatch<ActionKeysData extends keyof Actions>(
        key: ActionKeysData,
        payload?: Parameters<Actions[ActionKeysData]>[1],
        options?: Vuex.DispatchOptions
    ): ReturnType<Actions[ActionKeysData]>;
} & {
    getters: {
        [GetterKeysData in keyof Getters]: ReturnType<Getters[GetterKeysData]>;
    };
};

export const store: Store = Vuex.createStore<State>({
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: state,
});

export const useStore = () => store;
