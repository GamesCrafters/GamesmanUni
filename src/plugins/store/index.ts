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
    setLocale = "setLocale",
    setOptions = "setOptions",
    setPreFetchedRawPositionDatas = "setPreFetchedRawPositionDatas",
    setTheme = "setTheme",
    showInstruction = "showInstruction",
    showOptions = "showOptions",
}

type MutationsData = {
    [mutationTypes.setApp](state: StateData, app?: gamesmanUniTypes.AppData): void;
    [mutationTypes.setLatestCommitHistory](state: StateData, latestCommitHistory?: gamesmanUniTypes.AppLatestCommitHistoryData): void;
    [mutationTypes.setLocale](state: StateData, locale?: string): void;
    [mutationTypes.setOptions](state: StateData, options?: gamesmanUniTypes.AppGameOptionsData): void;
    [mutationTypes.setPreFetchedRawPositionDatas](state: StateData, preFetchedRawPositionDatas?: gamesmanUniTypes.AppGamePreFetchedRawPositionDatas): void;
    [mutationTypes.setTheme](state: StateData, theme?: string): void;
    [mutationTypes.showInstruction](state: StateData, showInstruction?: boolean): void;
    [mutationTypes.showOptions](state: StateData, showOptions?: boolean): void;
};

const mutations: MutationTree<StateData> & MutationsData = {
    setApp: (state: StateData, app?: gamesmanUniTypes.AppData): void => {
        state.app = app ? app : state.app;
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
    setPreFetchedRawPositionDatas: (state: StateData, preFetchedRawPositionDatas?: gamesmanUniTypes.AppGamePreFetchedRawPositionDatas): void => {
        state.app.game.preFetchedRawPositionDatas = preFetchedRawPositionDatas ? preFetchedRawPositionDatas : state.app.game.preFetchedRawPositionDatas;
    },
    setTheme: (state: StateData, theme?: string): void => {
        state.app.preferences.theme = theme ? theme : state.app.preferences.theme;
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
    preFetchRawGamePositionForAvailableMoves = "preFetchRawGamePositionForAvailableMoves",
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
    [actionTypes.preFetchRawGamePositionForAvailableMoves](context: ActionContext): void;
    [actionTypes.loadLatestCommitHistory](context: ActionContext): Promise<void>;
};

const actions: ActionTree<StateData, StateData> & ActionsData = {
    loadGames: async (context: ActionContext, type: string): Promise<void> => {
        let app: gamesmanUniTypes.AppData | undefined;
        if (type === "puzzles" && !context.state.app.puzzles.length) app = await gamesmanUni.loadGames(context.state.app, "puzzles");
        else if (type === "games" && !context.state.app.games.length) app = await gamesmanUni.loadGames(context.state.app, "games");
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
        context.dispatch(actionTypes.preFetchRawGamePositionForAvailableMoves);
    },
    restartGame: (context: ActionContext): void => {
        const app = gamesmanUni.restartGame(context.state.app);
        context.commit(mutationTypes.setApp, app);
        context.dispatch(actionTypes.preFetchRawGamePositionForAvailableMoves);
    },
    runMove: async (context: ActionContext, move: string): Promise<void> => {
        const app = await gamesmanUni.runMove(context.state.app, move);
        context.commit(mutationTypes.setApp, app);
        context.dispatch(actionTypes.preFetchRawGamePositionForAvailableMoves);
    },
    redoMove: (context: ActionContext): void => {
        const app = gamesmanUni.redoMove(context.state.app);
        context.commit(mutationTypes.setApp, app);
        if (context.state.app.game.round.id === context.state.app.game.history[context.state.app.game.history.length - 1].id) context.dispatch(actionTypes.preFetchRawGamePositionForAvailableMoves);
    },
    undoMove: (context: ActionContext): void => {
        const app = gamesmanUni.undoMove(context.state.app);
        context.commit(mutationTypes.setApp, app);
    },
    preFetchRawGamePositionForAvailableMoves: async (context: ActionContext): Promise<void> => {
        const app = await gamesmanUni.preFetchRawGamePositionForAvailableMoves(context.state.app);
        context.commit(mutationTypes.setPreFetchedRawPositionDatas, app.game.preFetchedRawPositionDatas);
    },
    loadLatestCommitHistory: async (context: ActionContext): Promise<void> => {
        if (!context.state.app.latestCommitHistory.length) {
            const latestCommitHistory = await gamesmanUni.loadLatestCommitHistory(context.state.app);
            context.commit(mutationTypes.setLatestCommitHistory, latestCommitHistory);
        }
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
