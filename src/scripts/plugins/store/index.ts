import * as Vuex from "vuex";
import * as Defaults from "../../../models/datas/defaultApp";
import * as GMU from "../../gamesmanUni";
import * as GMUTypes from "../../gamesmanUni/types";

export type State = { app: GMUTypes.App };

const state: State = { app: Defaults.defaultApp };

type Getters = {
    availableMove(state: State): (gameType: string, gameId: string, variantId: string, position: string, move: string) => GMUTypes.Move;
    availableMoves(state: State): (gameType: string, gameId: string, variantId: string, position: string) => GMUTypes.Moves;
    commit(state: State): (sha: string) => GMUTypes.Commit;
    commits(state: State): GMUTypes.Commits;
    currentAvailableMove(state: State): (move: string) => GMUTypes.Move;
    currentAvailableMoves(state: State): GMUTypes.Moves;
    currentGameId(state: State): string;
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
    currentPositionValue(state: State): string;
    currentRemoteness(state: State): number;
    currentRightPlayer(state: State): GMUTypes.User;
    currentRound(state: State): (roundId?: number) => GMUTypes.Round;
    currentRoundId(state: State): number;
    currentRounds(state: State): GMUTypes.Rounds;
    currentVariantId(state: State): string;
    dataSources(state: State): GMUTypes.DataSources;
    fallbackLocale(state: State): string;
    game(state: State): (gameType: string, gameId: string) => GMUTypes.Game;
    games(state: State): (gameType: string) => GMUTypes.Games;
    gitHubRepositoryAPI(state: State): string;
    isEndOfMatch(state: State): boolean;
    locale(state: State): string;
    maximumRemoteness(state: State): (from: number, to: number) => number;
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
    currentPositionValue: (state: State) => state.app.currentMatch.round.position.positionValue,
    currentRemoteness: (state: State) => state.app.currentMatch.round.position.remoteness,
    currentRightPlayer: (state: State) => (state.app.currentMatch.type !== "puzzles" ? state.app.users[state.app.currentMatch.players[1]] : { ...Defaults.defaultUser }),
    currentRound: (state: State) => (roundId?: number) => roundId ? state.app.currentMatch.rounds[roundId] : state.app.currentMatch.round,
    currentRoundId: (state: State) => state.app.currentMatch.round.id,
    currentRounds: (state: State) => state.app.currentMatch.rounds,
    currentVariantId: (state: State) => state.app.currentMatch.variantId,
    dataSources: (state: State) => state.app.dataSources,
    fallbackLocale: (state: State) => state.app.preferences.fallbackLocale,
    game: (state: State) => (gameType: string, gameId: string) => state.app.gameTypes[gameType].games[gameId],
    games: (state: State) => (gameType: string) => state.app.gameTypes[gameType],
    gitHubRepositoryAPI: (state: State) => state.app.dataSources.gitHubRepositoryAPI,
    isEndOfMatch: (state: State) => GMU.isEndOfMatch(state.app),
    locale: (state: State) => state.app.preferences.locale,
    maximumRemoteness: (state: State) => (from: number, to: number) => GMU.getMaximumRemoteness(state.app, { from, to }),
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
    setCurrentRightPlayerName: (state: State, rightPlayerName: string) => {
        state.app.users[state.app.currentMatch.players[1]].name;
        state.app.users[state.app.currentMatch.players[1]].name = rightPlayerName;
        state.app.users[state.app.currentMatch.players[1]].name;
    },
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
    redoMove = "redoMove",
    undoMove = "undoMove",
    preFetchNextPositions = "preFetchNextPositions",
    loadLatestCommits = "loadLatestCommits",
}

type Actions = {
    [actionTypes.loadGames](context: ActionContext, payload: { type: string }): Promise<void>;
    [actionTypes.loadVariants](context: ActionContext, payload: { type: string; gameId: string }): Promise<void>;
    [actionTypes.initiateMatch](context: ActionContext, payload: { gameType: string; gameId: string; variantId: string; matchType?: string }): Promise<void>;
    [actionTypes.exitMatch](context: ActionContext): void;
    [actionTypes.restartMatch](context: ActionContext): void;
    [actionTypes.runMove](context: ActionContext, payload: { move: string }): Promise<void>;
    [actionTypes.redoMove](context: ActionContext, payload?: { count?: number }): void;
    [actionTypes.undoMove](context: ActionContext, payload?: { count?: number }): void;
    [actionTypes.preFetchNextPositions](context: ActionContext): void;
    [actionTypes.loadLatestCommits](context: ActionContext): Promise<void>;
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
    initiateMatch: async (context: ActionContext, payload: { gameType: string; gameId: string; variantId: string; matchType?: string }) => {
        const updatedApp = await GMU.initiateMatch(context.state.app, payload);
        if (updatedApp) {
            context.commit(mutationTypes.setApp, updatedApp);
            context.dispatch(actionTypes.preFetchNextPositions);
        }
    },
    exitMatch: (context: ActionContext) => context.commit(mutationTypes.setApp, GMU.exitMatch(context.state.app)),
    restartMatch: (context: ActionContext) => context.commit(mutationTypes.setApp, GMU.restartMatch(context.state.app)),
    runMove: async (context: ActionContext, payload: { move: string }) => {
        const updatedApp = await GMU.runMove(context.state.app, payload);
        if (updatedApp) {
            context.commit(mutationTypes.setApp, updatedApp);
            context.dispatch(actionTypes.preFetchNextPositions);
        }
    },
    redoMove: async (context: ActionContext, payload?: { count?: number }) => {
        context.commit(mutationTypes.setApp, await GMU.redoMove(context.state.app, payload));
        if (!context.state.app.currentMatch.rounds[context.state.app.currentMatch.round.id + 1]) context.dispatch(actionTypes.preFetchNextPositions);
    },
    undoMove: async (context: ActionContext, payload?: { count?: number }) => context.commit(mutationTypes.setApp, await GMU.undoMove(context.state.app, payload)),
    preFetchNextPositions: async (context: ActionContext) => context.commit(mutationTypes.setApp, await GMU.preFetchNextPositions(context.state.app, { gameType: context.state.app.currentMatch.gameType, gameId: context.state.app.currentMatch.gameId, variantId: context.state.app.currentMatch.variantId, position: context.state.app.currentMatch.round.position.position })),
    loadLatestCommits: async (context: ActionContext) => {
        const updatedApp = await GMU.loadCommits(context.state.app);
        if (updatedApp) context.commit(mutationTypes.setApp, updatedApp);
    },
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
