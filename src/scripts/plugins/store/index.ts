import * as Vuex from "vuex";
import * as Defaults from "../../../models/datas/defaultApp";
import * as GMU from "../../gamesmanUni";
import * as GMUTypes from "../../gamesmanUni/types";

export type State = { app: GMUTypes.App };

const state: State = { app: Defaults.defaultApp };

const preFetchEnabled: boolean = false;

type Getters = {
    availableMove(state: State): (gameType: string, gameId: string, variantId: string, position: string, move: string) => GMUTypes.Move;
    availableMoves(state: State): (gameType: string, gameId: string, variantId: string, position: string) => GMUTypes.Moves;
    commit(state: State): (sha: string) => GMUTypes.Commit;
    commits(state: State): GMUTypes.Commits;
    currentAvailableMove(state: State): (move: string) => GMUTypes.Move;
    currentAvailableMoves(state: State): GMUTypes.Moves;
    currentGameId(state: State): string;
    currentGameName(state: State): string;
    currentGameTheme(state: State): string;
    currentGameType(state: State): string;
    currentLeftPlayer(state: State): GMUTypes.User;
    currentMatch(state: State): GMUTypes.Match;
    currentMatchId(state: State): number;
    currentMatchType(state: State): string;
    currentMove(state: State): string;
    currentMoveValue(state: State): string;
    currentPlayer(state: State): GMUTypes.User;
    currentPlayers(state: State): GMUTypes.Users;
    currentPosition(state: State): string;
    currentPositionMex(state: State): string;
    currentPositionValue(state: State): string;
    currentRemoteness(state: State): number;
    currentRightPlayer(state: State): GMUTypes.User;
    currentRound(state: State): (roundId?: number) => GMUTypes.Round;
    currentRoundId(state: State): number;
    currentRounds(state: State): GMUTypes.Rounds;
    currentStartPosition(state: State): string;
    currentVariantId(state: State): string;
    dataSources(state: State): GMUTypes.DataSources;
    fallbackLocale(state: State): string;
    game(state: State): (gameType: string, gameId: string) => GMUTypes.Game;
    games(state: State): (gameType: string) => GMUTypes.Games;
    gitHubRepositoryAPI(state: State): string;
    isEndOfMatch(state: State): boolean;
    locale(state: State): string;
    maximumRemoteness(state: State): (from: number, to: number) => number;
    moveHistory(state: State): string;
    backgroundLoading(state: State): boolean;
    onePlayerGameAPI(state: State): string;
    position(state: State): (gameType: string, gameId: string, variantId: string, position: string) => GMUTypes.Position;
    positions(state: State): (gameType: string, gameId: string, variantId: string) => GMUTypes.Positions;
    preferences(state: State): GMUTypes.Preferences;
    rootFontSize(state: State): string;
    theme(state: State): string;
    twoPlayerGameAPI(state: State): string;
    user(state: State): (userId: string) => GMUTypes.User;
    userMatch(state: State): (userId: string, matchId: number) => GMUTypes.Match;
    userMatchs(state: State): (userId: string) => GMUTypes.Matches;
    userOptions(state: State): (userId: string) => GMUTypes.Options;
    users(state: State): GMUTypes.Users;
    variant(state: State): (gameType: string, gameId: string, variantId: string) => GMUTypes.Variant;
    variants(state: State): (gameType: string, gameId: string) => GMUTypes.Variants;
    version(state: State): string;
};

const getters: Vuex.GetterTree<State, State> & Getters = {
    availableMove: (state: State) => (gameType: string, gameId: string, variantId: string, position: string, move: string) => state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].positions[position].availableMoves[move],
    availableMoves: (state: State) => (gameType: string, gameId: string, variantId: string, position: string) => state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].positions[position].availableMoves,
    commit: (state: State) => (sha: string) => state.app.commits.commits[sha],
    commits: (state: State) => state.app.commits,
    currentAvailableMove: (state: State) => (move: string) => state.app.currentMatch.round.position.availableMoves[move],
    currentAvailableMoves: (state: State) => state.app.currentMatch.round.position.availableMoves,
    currentGameId: (state: State) => state.app.currentMatch.gameId,
    currentGameName: (state: State) => state.app.gameTypes[state.app.currentMatch.gameType].games[state.app.currentMatch.gameId].name,
    currentGameType: (state: State) => state.app.currentMatch.gameType,
    currentLeftPlayer: (state: State) => state.app.users[state.app.currentMatch.players[0]],
    currentMatch: (state: State) => state.app.currentMatch,
    currentMatchId: (state: State) => state.app.currentMatch.id,
    currentMatchType: (state: State) => state.app.currentMatch.type,
    currentMove: (state: State) => state.app.currentMatch.round.move,
    currentMoveValue: (state: State) => state.app.currentMatch.round.moveValue,
    currentPlayer: (state: State) => state.app.users[state.app.currentMatch.round.playerId],
    currentPlayers: (state: State) => {
        const currentPlayers: GMUTypes.Users = {};
        currentPlayers[state.app.currentMatch.players[0]] = state.app.users[state.app.currentMatch.players[0]];
        if (state.app.currentMatch.players[1]) currentPlayers[state.app.currentMatch.players[1]] = state.app.users[state.app.currentMatch.players[1]];
        return currentPlayers;
    },
    currentPosition: (state: State) => state.app.currentMatch.round.position.position,
    currentPositionMex: (state: State) => state.app.currentMatch.round.position.mex,
    currentPositionValue: (state: State) => state.app.currentMatch.round.position.positionValue,
    currentRemoteness: (state: State) => state.app.currentMatch.round.position.remoteness,
    currentRightPlayer: (state: State) => (state.app.currentMatch.type !== "puzzles" ? state.app.users[state.app.currentMatch.players[1]] : { ...Defaults.defaultUser }),
    currentRound: (state: State) => (roundId?: number) => roundId ? state.app.currentMatch.rounds[roundId] : state.app.currentMatch.round,
    currentRoundId: (state: State) => state.app.currentMatch.round.id,
    currentRounds: (state: State) => state.app.currentMatch.rounds,
    currentStartPosition: (state: State) => state.app.currentMatch.startPosition,
    currentGameTheme: (state: State) => state.app.currentMatch.gameTheme,
    currentVariantId: (state: State) => state.app.currentMatch.variantId,
    dataSources: (state: State) => state.app.dataSources,
    fallbackLocale: (state: State) => state.app.preferences.fallbackLocale,
    game: (state: State) => (gameType: string, gameId: string) => state.app.gameTypes[gameType].games[gameId],
    games: (state: State) => (gameType: string) => state.app.gameTypes[gameType],
    gitHubRepositoryAPI: (state: State) => state.app.dataSources.gitHubRepositoryAPI,
    isEndOfMatch: (state: State) => GMU.isEndOfMatch(state.app),
    locale: (state: State) => state.app.preferences.locale,
    maximumRemoteness: (state: State) => (from: number, to: number) => GMU.getMaximumRemoteness(state.app, { from, to }),
    moveHistory: (state: State) => state.app.currentMatch.moveHistory,
    backgroundLoading: (state: State) => state.app.currentMatch.backgroundLoading,
    onePlayerGameAPI: (state: State) => state.app.dataSources.onePlayerGameAPI,
    position: (state: State) => (gameType: string, gameId: string, variantId: string, position: string) => state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].positions[position],
    positions: (state: State) => (gameType: string, gameId: string, variantId: string) => state.app.gameTypes[gameType].games[gameId].variants.variants[variantId].positions,
    preferences: (state: State) => state.app.preferences,
    rootFontSize: (state: State) => state.app.preferences.rootFontSize,
    theme: (state: State) => state.app.preferences.theme,
    twoPlayerGameAPI: (state: State) => state.app.dataSources.twoPlayerGameAPI,
    user: (state: State) => (userId: string) => state.app.users[userId],
    userMatch: (state: State) => (userId: string, matchId: number) => state.app.users[userId].matches[matchId],
    userMatchs: (state: State) => (userId: string) => state.app.users[userId].matches,
    userOptions: (state: State) => (userId: string) => state.app.users[userId].options,
    users: (state: State) => state.app.users,
    variant: (state: State) => (gameType: string, gameId: string, variantId: string) => state.app.gameTypes[gameType].games[gameId].variants.variants[variantId],
    variants: (state: State) => (gameType: string, gameId: string) => state.app.gameTypes[gameType].games[gameId].variants,
    version: (state: State) => state.app.version,
};

export enum mutationTypes {
    setApp = "setApp",
    setCurrentLeftPlayerName = "setCurrentLeftPlayerName",
    setCurrentRightPlayerName = "setCurrentRightPlayerName",
    setCurrentPlayerName = "setCurrentPlayerName",
    setLocale = "setLocale",
    setOptions = "setOptions",
    setRootFontSize = "setRootFontSize",
    setTheme = "setTheme",
    showInstructions = "showInstructions",
    showOptions = "showOptions",
    showVvhGuides = "showVvhGuides",
    showVvhMeters = "showVvhMeters",
}

type Mutations = {
    [mutationTypes.setApp](state: State, app: GMUTypes.App): void;
    [mutationTypes.setCurrentLeftPlayerName](state: State, leftPlayerName: string): void;
    [mutationTypes.setCurrentRightPlayerName](state: State, rightPlayerName: string): void;
    [mutationTypes.setCurrentPlayerName](state: State, playerName: string): void;
    [mutationTypes.setLocale](state: State, locale: string): void;
    [mutationTypes.setOptions](state: State, options: GMUTypes.Options): void;
    [mutationTypes.setRootFontSize](state: State, rootFontSize: string): void;
    [mutationTypes.setTheme](state: State, theme: string): void;
    [mutationTypes.showInstructions](state: State, showInstructions: boolean): void;
    [mutationTypes.showOptions](state: State, showOptions: boolean): void;
    [mutationTypes.showVvhGuides](state: State, showVvhGuides: boolean): void;
    [mutationTypes.showVvhMeters](state: State, showVvhMeters: boolean): void;
};

const mutations: Vuex.MutationTree<State> & Mutations = {
    setApp: (state: State, app: GMUTypes.App) => (state.app = app),
    setCurrentLeftPlayerName: (state: State, leftPlayerName: string) => (state.app.users[state.app.currentMatch.players[0]].name = leftPlayerName),
    setCurrentRightPlayerName: (state: State, rightPlayerName: string) => (state.app.users[state.app.currentMatch.players[1]].name = rightPlayerName),
    setCurrentPlayerName: (state: State, playerName: string) => (state.app.users[state.app.currentMatch.players[0]].name = playerName),
    setLocale: (state: State, locale: string) => (state.app.preferences.locale = locale ? locale : state.app.preferences.locale),
    setOptions: (state: State, options: GMUTypes.Options) => {
        for (const player of state.app.currentMatch.players) state.app.users[player].options = options;
    },
    setRootFontSize: (state: State, rootFontSize: string) => (state.app.preferences.rootFontSize = rootFontSize ? rootFontSize : state.app.preferences.rootFontSize),
    setTheme: (state: State, theme?: string) => (state.app.preferences.theme = theme ? theme : state.app.preferences.theme),
    showInstructions: (state: State, showInstructions: boolean) => {
        for (const player of state.app.currentMatch.players) state.app.users[player].options.showInstructions = showInstructions;
    },
    showOptions: (state: State, showOptions: boolean) => {
        for (const player of state.app.currentMatch.players) state.app.users[player].options.showOptions = showOptions;
    },
    showVvhGuides: (state: State, showVvhGuides: boolean) => {
        for (const player of state.app.currentMatch.players) state.app.users[player].options.showVvhGuides = showVvhGuides;
    },
    showVvhMeters: (state: State, showVvhMeters: boolean) => {
        for (const player of state.app.currentMatch.players) state.app.users[player].options.showVvhMeters = showVvhMeters;
    },
};

type ActionContext = Omit<Vuex.ActionContext<State, State>, "commit"> & {
    commit<MutationKeys extends keyof Mutations>(key: MutationKeys, payload: Parameters<Mutations[MutationKeys]>[1]): ReturnType<Mutations[MutationKeys]>;
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
    updateMatchType = "updateMatchType",
    updateMatchStartPosition = "updateMatchStartPosition",
    preFetchNextPositions = "preFetchNextPositions",
    loadLatestCommits = "loadLatestCommits",
    loadMoveHistory = "loadMoveHistory"
}

type Actions = {
    [actionTypes.loadGames](context: ActionContext, payload: { type: string }): Promise<void>;
    [actionTypes.loadVariants](context: ActionContext, payload: { type: string; gameId: string }): Promise<void>;
    [actionTypes.initiateMatch](context: ActionContext, payload: {
        gameType: string
        gameId: string;
        variantId: string;
        matchType?: string;
        startPosition?: string
    }): Promise<void>;
    [actionTypes.exitMatch](context: ActionContext): void;
    [actionTypes.restartMatch](context: ActionContext, payload?: { matchType?: string }): Promise<void>;
    [actionTypes.runMove](context: ActionContext, payload: { move: string }): Promise<void>;
    [actionTypes.runComputerMove](context: ActionContext): Promise<void>;
    [actionTypes.redoMove](context: ActionContext, payload?: { count?: number }): Promise<void>;
    [actionTypes.undoMove](context: ActionContext, payload?: { count?: number }): Promise<void>;
    [actionTypes.updateGameTheme](context: ActionContext, payload: { gameTheme : string }): void;
    [actionTypes.updateMatchType](context: ActionContext, payload: { matchType: string; players: Array<string> }): void;
    [actionTypes.updateMatchStartPosition](context: ActionContext, payload: { position: string }): Promise<void | Error>;
    [actionTypes.preFetchNextPositions](context: ActionContext): Promise<void>;
    [actionTypes.loadLatestCommits](context: ActionContext): Promise<void>;
    [actionTypes.loadMoveHistory](context: ActionContext, payload: { history: string }): Promise<void | Error>;
};

const actions: Vuex.ActionTree<State, State> & Actions = {
    loadGames: async (context: ActionContext, payload: { type: string }) => {
        const updatedApp = await GMU.loadGames(context.state.app, { gameType: payload.type });
        if (updatedApp) context.commit(mutationTypes.setApp, updatedApp);
    },
    loadVariants: async (context: ActionContext, payload: { type: string; gameId: string }) => {
        const updatedApp = await GMU.loadVariants(context.state.app, { gameType: payload.type, gameId: payload.gameId });
        if (updatedApp) context.commit(mutationTypes.setApp, updatedApp);
    },
    initiateMatch: async (context: ActionContext, payload: {
        gameType: string;
        gameId: string;
        variantId: string;
        matchType?: string;
        startPosition?: string
    }) => {
        const updatedApp = await GMU.initiateMatch(context.state.app, payload);
        if (updatedApp) {
            context.commit(mutationTypes.setApp, updatedApp);
            if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
        }
        await store.dispatch(actionTypes.runComputerMove);
    },
    exitMatch: (context: ActionContext) => context.commit(mutationTypes.setApp, GMU.exitMatch(context.state.app)),
    restartMatch: async (context: ActionContext, payload?: { matchType?: string }) => {
        const currentGameType = context.getters.currentGameType;
        const currentGameId = context.getters.currentGameId;
        const currentVariantId = context.getters.currentVariantId;
        const currentMatchType = context.getters.currentMatchType;
        const currentStartPosition = context.getters.currentStartPosition;

        context.dispatch(actionTypes.exitMatch);
        await context.dispatch(actionTypes.initiateMatch, {
            gameType: currentGameType,
            gameId: currentGameId,
            variantId: currentVariantId,
            matchType: (payload && payload.matchType) ? payload.matchType : currentMatchType,
            startPosition: currentStartPosition
        });
    },
    runMove: async (context: ActionContext, payload: { move: string }) => {
        context.state.app.currentMatch.backgroundLoading = true;
        const updatedApp = await GMU.runMove(context.state.app, payload);
        if (updatedApp) {
            context.commit(mutationTypes.setApp, updatedApp);
            if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
        }
        await store.dispatch(actionTypes.runComputerMove);
        context.state.app.currentMatch.backgroundLoading = false;
    },
    runComputerMove: async (context: ActionContext) => {
        while (context.getters.currentPlayer.id[0] === "c" && !GMU.isEndOfMatch(context.state.app)) {
            await new Promise((resolve) => setTimeout(resolve, store.getters.currentPlayer.options.computerMoveDuration));
            const updatedApp = await GMU.runMove(context.state.app, { move: GMU.generateComputerMove(context.state.app.currentMatch.round) });
            if (updatedApp) {
                context.commit(mutationTypes.setApp, updatedApp);
                if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
            }
        }
    },
    redoMove: async (context: ActionContext, payload?: { count?: number }) => {
        context.commit(mutationTypes.setApp, GMU.redoMove(context.state.app, payload));
        if (!context.state.app.currentMatch.rounds[context.state.app.currentMatch.round.id + 1]) {
            if (preFetchEnabled) context.dispatch(actionTypes.preFetchNextPositions);
        }
        await store.dispatch(actionTypes.runComputerMove);
    },
    undoMove: async (context: ActionContext, payload?: { count?: number }) => {
        context.commit(mutationTypes.setApp, GMU.undoMove(context.state.app, payload));
        await store.dispatch(actionTypes.runComputerMove);
    },
    updateGameTheme: (context: ActionContext, payload: { gameTheme : string }) => {
        const updatedApp = GMU.updateGameTheme(context.state.app, payload);
        context.commit(mutationTypes.setApp, updatedApp);
    },
    updateMatchType: (context: ActionContext, payload: { matchType: string; players: Array<string> }) => {
        const updatedApp = GMU.updateMatchType(context.state.app, payload);
        context.commit(mutationTypes.setApp, updatedApp);
    },
    updateMatchStartPosition: async (context: ActionContext, payload: { position: string }) => {
        const updatedAppOrError = await GMU.updateMatchStartPosition(context.state.app, payload);
        if (updatedAppOrError instanceof Error) {
            return updatedAppOrError;
        } else {
            context.commit(mutationTypes.setApp, updatedAppOrError);
            await context.dispatch(actionTypes.restartMatch, {
                matchType: context.state.app.currentMatch.gameType  === "puzzles" ? "p" : "pvp"
            });
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
    commit<MutationKeysData extends keyof Mutations, MutationParametersData extends Parameters<Mutations[MutationKeysData]>[1]>(key: MutationKeysData, payload: MutationParametersData, options?: Vuex.CommitOptions): ReturnType<Mutations[MutationKeysData]>;
} & {
    dispatch<ActionKeysData extends keyof Actions>(key: ActionKeysData, payload?: Parameters<Actions[ActionKeysData]>[1], options?: Vuex.DispatchOptions): ReturnType<Actions[ActionKeysData]>;
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
