import { ActionContext as BaseActionContext, ActionTree, CommitOptions, createStore, DispatchOptions, GetterTree, MutationTree, Store } from "vuex";
import { defaultApp } from "../../models/datas/defaultApp";
import * as gamesmanUni from "../../scripts/gamesmanUni";
import * as gamesmanUniTypes from "../../scripts/gamesmanUniTypes";

export type StateData = {
    app: gamesmanUniTypes.AppData;
};

type GettersData = {};

export enum mutationTypes {
    setLatestCommitHistory = "setLatestCommitHistory",
    setGame = "setGame",
    setGames = "setGames",
    setLocale = "setLocale",
    setTheme = "setTheme",
    setVariant = "setVariant",
    setVariants = "setVariants",
}

type MutationsData = {
    [mutationTypes.setLatestCommitHistory](state: StateData, latestCommitHistory?: gamesmanUniTypes.AppLatestCommitHistoryData): void;
    [mutationTypes.setGame](state: StateData, game?: gamesmanUniTypes.AppGameData): void;
    [mutationTypes.setGames](state: StateData, games?: gamesmanUniTypes.AppGamesData): void;
    [mutationTypes.setLocale](state: StateData, locale?: string): void;
    [mutationTypes.setTheme](state: StateData, theme?: string): void;
    [mutationTypes.setVariant](state: StateData, variant?: gamesmanUniTypes.AppGameVariantData): void;
    [mutationTypes.setVariants](state: StateData, variants?: gamesmanUniTypes.AppGameVariantsData): void;
};

type ActionContext = Omit<BaseActionContext<StateData, StateData>, "commit"> & {
    commit<MutationKeysData extends keyof MutationsData>(key: MutationKeysData, payload: Parameters<MutationsData[MutationKeysData]>[1]): ReturnType<MutationsData[MutationKeysData]>;
};

export enum actionTypes {
    loadGames = "loadGames",
    loadVariants = "loadVariants",
    loadLatestCommitHistory = "loadLatestCommitHistory",
}

type ActionsData = {
    [actionTypes.loadGames](context: ActionContext, type: string): Promise<void>;
    [actionTypes.loadVariants](context: ActionContext, payload: { type: string; gameId: string }): Promise<void>;
    [actionTypes.loadLatestCommitHistory](context: ActionContext): Promise<void>;
};

type StoreData = Omit<Store<StateData>, "getters" | "commit" | "dispatch"> & {
    commit<MutationKeysData extends keyof MutationsData, MutationParametersData extends Parameters<MutationsData[MutationKeysData]>[1]>(key: MutationKeysData, payload: MutationParametersData, options?: CommitOptions): ReturnType<MutationsData[MutationKeysData]>;
} & {
    dispatch<ActionKeysData extends keyof ActionsData>(key: ActionKeysData, payload?: Parameters<ActionsData[ActionKeysData]>[1], options?: DispatchOptions): ReturnType<ActionsData[ActionKeysData]>;
} & {
    getters: {
        [GetterKeysData in keyof GettersData]: ReturnType<GettersData[GetterKeysData]>;
    };
};

const state: StateData = {
    app: defaultApp,
};

const getters: GetterTree<StateData, StateData> & GettersData = {};

const mutations: MutationTree<StateData> & MutationsData = {
    setGame: (state: StateData, game?: gamesmanUniTypes.AppGameData): void => {
        state.app.game = game ? game : defaultApp.game;
    },
    setGames: (state: StateData, games?: gamesmanUniTypes.AppGamesData): void => {
        state.app.games = games ? games : defaultApp.games;
    },
    setLatestCommitHistory: (state: StateData, latestCommitHistory?: gamesmanUniTypes.AppLatestCommitHistoryData): void => {
        state.app.latestCommitHistory = latestCommitHistory ? latestCommitHistory : defaultApp.latestCommitHistory;
    },
    setLocale: (state: StateData, locale?: string): void => {
        state.app.preferences.locale = locale ? locale : defaultApp.preferences.locale;
    },
    setTheme: (state: StateData, theme?: string): void => {
        state.app.preferences.theme = theme ? theme : defaultApp.preferences.theme;
    },
    setVariant: (state: StateData, variant?: gamesmanUniTypes.AppGameVariantData): void => {
        state.app.game.variant = variant ? variant : defaultApp.game.variant;
    },
    setVariants: (state: StateData, variants?: gamesmanUniTypes.AppGameVariantsData): void => {
        state.app.game.variants = variants ? variants : defaultApp.game.variants;
    },
};

const actions: ActionTree<StateData, StateData> & ActionsData = {
    loadGames: async (context: ActionContext, type: string): Promise<void> => {
        const games = await gamesmanUni.loadGames(context.state.app, type);
        context.commit(mutationTypes.setGames, games);
    },
    loadVariants: async (context: ActionContext, payload: { type: string; gameId: string }): Promise<void> => {
        const game = await gamesmanUni.loadGameVariants(context.state.app, payload.type, payload.gameId);
        context.commit(mutationTypes.setGame, game);
    },
    loadLatestCommitHistory: async (context: ActionContext): Promise<void> => {
        const latestCommitHistory = await gamesmanUni.loadLatestCommitHistory(context.state.app);
        context.commit(mutationTypes.setLatestCommitHistory, latestCommitHistory);
    },
};

export const store: StoreData = createStore<StateData>({
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: state,
});

export function useStore(): StoreData {
    return store;
}
