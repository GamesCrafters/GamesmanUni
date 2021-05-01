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
    setOptions: (state: StateData, options?: gamesmanUniTypes.AppGameOptionsData): void => {
        state.app.game.options = options ? options : defaultApp.game.options;
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
    showInstruction: (state: StateData, showInstruction?: boolean): void => {
        state.app.game.options.showInstruction = showInstruction != undefined ? showInstruction : defaultApp.game.options.showInstruction;
    },
    showOptions: (state: StateData, showOptions?: boolean): void => {
        state.app.game.options.showOptions = showOptions != undefined ? showOptions : defaultApp.game.options.showOptions;
    },
};

type ActionContext = Omit<BaseActionContext<StateData, StateData>, "commit"> & {
    commit<MutationKeysData extends keyof MutationsData>(key: MutationKeysData, payload: Parameters<MutationsData[MutationKeysData]>[1]): ReturnType<MutationsData[MutationKeysData]>;
};

export enum actionTypes {
    drawVisualValueHistory = "drawVisualValueHistory",
    initiateGame = "initiateGame",
    loadGames = "loadGames",
    loadVariants = "loadVariants",
    loadLatestCommitHistory = "loadLatestCommitHistory",
    redoMove = "redoMove",
    undoMove = "undoMove",
}

type ActionsData = {
    [actionTypes.drawVisualValueHistory](context: ActionContext): Promise<void>;
    [actionTypes.initiateGame](context: ActionContext, payload: { type: string; gameId: string; variantId: string }): Promise<void>;
    [actionTypes.loadGames](context: ActionContext, type: string): Promise<void>;
    [actionTypes.loadVariants](context: ActionContext, payload: { type: string; gameId: string }): Promise<void>;
    [actionTypes.loadLatestCommitHistory](context: ActionContext): Promise<void>;
    [actionTypes.redoMove](context: ActionContext): void;
    [actionTypes.undoMove](context: ActionContext): void;
};

const actions: ActionTree<StateData, StateData> & ActionsData = {
    drawVisualValueHistory: async (context: ActionContext): Promise<void> => {},
    initiateGame: async (context: ActionContext, payload: { type: string; gameId: string; variantId: string }): Promise<void> => {
        if (!context.state.app.game.name) {
            await context.dispatch(actionTypes.loadVariants, { type: payload.type, gameId: payload.gameId });
        }
        context.commit(mutationTypes.setVariant, context.state.app.game.variants.find((variant) => variant.id === payload.variantId)!);
        const game = await gamesmanUni.loadGamePosition(context.state.app, payload.type, payload.gameId, payload.variantId, context.state.app.game.variant.startPosition);
        context.commit(mutationTypes.setGame, game);
    },
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
    redoMove: (context: ActionContext): void => {
        const game = gamesmanUni.redoMove(context.state.app.game);
        context.commit(mutationTypes.setGame, game);
    },
    undoMove: (context: ActionContext): void => {
        const game = gamesmanUni.undoMove(context.state.app.game);
        context.commit(mutationTypes.setGame, game);
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
