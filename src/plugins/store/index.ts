import { ActionContext as BaseActionContext, ActionTree, CommitOptions, createStore, DispatchOptions, GetterTree, MutationTree, Store } from "vuex";
import { defaultApp } from "../../models/datas/defaultApp";
import * as gamesmanUni from "../../scripts/gamesmanUni";
import * as gamesmanUniTypes from "../../scripts/gamesmanUniTypes";

export type StateData = {
    app: gamesmanUniTypes.AppData;
};

const state: StateData = {
    app: defaultApp,
};

type GettersData = {};

const getters: GetterTree<StateData, StateData> & GettersData = {};

export enum mutationTypes {
    setApp = "setApp",
    setLatestCommitHistory = "setLatestCommitHistory",
    setGame = "setGame",
    setGames = "setGames",
    setLocale = "setLocale",
    setOptions = "setOptions",
    setTheme = "setTheme",
    setVariant = "setVariant",
    setVariants = "setVariants",
    showInstruction = "showInstruction",
    showOptions = "showOptions",
}

type MutationsData = {
    [mutationTypes.setApp](state: StateData, app?: gamesmanUniTypes.AppData): void;
    [mutationTypes.setLatestCommitHistory](state: StateData, latestCommitHistory?: gamesmanUniTypes.AppLatestCommitHistoryData): void;
    [mutationTypes.setGame](state: StateData, game?: gamesmanUniTypes.AppGameData): void;
    [mutationTypes.setGames](state: StateData, games?: gamesmanUniTypes.AppGamesData): void;
    [mutationTypes.setLocale](state: StateData, locale?: string): void;
    [mutationTypes.setOptions](state: StateData, options?: gamesmanUniTypes.AppGameOptionsData): void;
    [mutationTypes.setTheme](state: StateData, theme?: string): void;
    [mutationTypes.setVariant](state: StateData, variant?: gamesmanUniTypes.AppGameVariantData): void;
    [mutationTypes.setVariants](state: StateData, variants?: gamesmanUniTypes.AppGameVariantsData): void;
    [mutationTypes.showInstruction](state: StateData, showInstruction?: boolean): void;
    [mutationTypes.showOptions](state: StateData, showOptions?: boolean): void;
};

const mutations: MutationTree<StateData> & MutationsData = {
    setApp: (state: StateData, app?: gamesmanUniTypes.AppData): void => {
        state.app = app ? app : state.app;
    },
    setGame: (state: StateData, game?: gamesmanUniTypes.AppGameData): void => {
        state.app.game = game ? game : state.app.game;
    },
    setGames: (state: StateData, games?: gamesmanUniTypes.AppGamesData): void => {
        state.app.games = games ? games : state.app.games;
    },
    setLatestCommitHistory: (state: StateData, latestCommitHistory?: gamesmanUniTypes.AppLatestCommitHistoryData): void => {
        state.app.latestCommitHistory = latestCommitHistory ? latestCommitHistory : state.app.latestCommitHistory;
    },
    setLocale: (state: StateData, locale?: string): void => {
        state.app.preferences.locale = locale ? locale : state.app.preferences.locale;
    },
    setOptions: (state: StateData, options?: gamesmanUniTypes.AppGameOptionsData): void => {
        state.app.game.options = options ? options : state.app.game.options;
    },
    setTheme: (state: StateData, theme?: string): void => {
        state.app.preferences.theme = theme ? theme : state.app.preferences.theme;
    },
    setVariant: (state: StateData, variant?: gamesmanUniTypes.AppGameVariantData): void => {
        state.app.game.variant = variant ? variant : state.app.game.variant;
    },
    setVariants: (state: StateData, variants?: gamesmanUniTypes.AppGameVariantsData): void => {
        state.app.game.variants = variants ? variants : state.app.game.variants;
    },
    showInstruction: (state: StateData, showInstruction?: boolean): void => {
        state.app.game.options.showInstruction = showInstruction != undefined ? showInstruction : state.app.game.options.showInstruction;
    },
    showOptions: (state: StateData, showOptions?: boolean): void => {
        state.app.game.options.showOptions = showOptions != undefined ? showOptions : state.app.game.options.showOptions;
    },
};

type ActionContext = Omit<BaseActionContext<StateData, StateData>, "commit"> & {
    commit<MutationKeysData extends keyof MutationsData>(key: MutationKeysData, payload: Parameters<MutationsData[MutationKeysData]>[1]): ReturnType<MutationsData[MutationKeysData]>;
};

export enum actionTypes {
    loadGames = "loadGames",
    loadVariants = "loadVariants",
    initiateGame = "initiateGame",
    restartGame = "restartGame",
    runMove = "runMove",
    redoMove = "redoMove",
    undoMove = "undoMove",
    loadLatestCommitHistory = "loadLatestCommitHistory",
}

type ActionsData = {
    [actionTypes.loadGames](context: ActionContext, type: string): Promise<void>;
    [actionTypes.loadVariants](context: ActionContext, payload: { type: string; gameId: string }): Promise<void>;
    [actionTypes.initiateGame](context: ActionContext, payload: { type: string; gameId: string; variantId: string }): Promise<void>;
    [actionTypes.restartGame](context: ActionContext): void;
    [actionTypes.runMove](context: ActionContext, move: string): Promise<void>;
    [actionTypes.redoMove](context: ActionContext): void;
    [actionTypes.undoMove](context: ActionContext): void;
    [actionTypes.loadLatestCommitHistory](context: ActionContext): Promise<void>;
};

const actions: ActionTree<StateData, StateData> & ActionsData = {
    loadGames: async (context: ActionContext, type: string): Promise<void> => {
        const app = await gamesmanUni.loadGames(context.state.app, type);
        context.commit(mutationTypes.setApp, app);
    },
    loadVariants: async (context: ActionContext, payload: { type: string; gameId: string }): Promise<void> => {
        const app = await gamesmanUni.loadGameVariants(context.state.app, payload.type, payload.gameId);
        context.commit(mutationTypes.setApp, app);
    },
    initiateGame: async (context: ActionContext, payload: { type: string; gameId: string; variantId: string }): Promise<void> => {
        if (!context.state.app.games.length) {
            await context.dispatch(actionTypes.loadVariants, { type: payload.type, gameId: payload.gameId });
        }
        const app = await gamesmanUni.initiateGame(context.state.app, payload.type, payload.gameId, payload.variantId);
        context.commit(mutationTypes.setApp, app);
    },
    restartGame: (context: ActionContext): void => {
        const app = gamesmanUni.restartGame(context.state.app);
        context.commit(mutationTypes.setApp, app);
    },
    runMove: async (context: ActionContext, move: string): Promise<void> => {
        const app = await gamesmanUni.runMove(context.state.app, move);
        context.commit(mutationTypes.setApp, app);
    },
    redoMove: (context: ActionContext): void => {
        const app = gamesmanUni.redoMove(context.state.app);
        context.commit(mutationTypes.setApp, app);
    },
    undoMove: (context: ActionContext): void => {
        const app = gamesmanUni.undoMove(context.state.app);
        context.commit(mutationTypes.setApp, app);
    },
    loadLatestCommitHistory: async (context: ActionContext): Promise<void> => {
        const latestCommitHistory = await gamesmanUni.loadLatestCommitHistory(context.state.app);
        context.commit(mutationTypes.setLatestCommitHistory, latestCommitHistory);
    },
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

export const store: StoreData = createStore<StateData>({
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: state,
});

export function useStore(): StoreData {
    return store;
}
