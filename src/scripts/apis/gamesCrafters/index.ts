import axios from "axios";
import type * as Types from "./types";

export const loadData = async <DataType extends Types.Status>(dataSource: string) => {
    let data: DataType | Types.Error;
    try {
        data = (await axios.get(dataSource)).data;
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load data from ${dataSource}.`);
        return undefined;
    }
    if (data.status === "error") {
        console.error((<Types.Error>data).error);
        console.error(`Error: Returned error from ${dataSource}`);
        return undefined;
    }
    console.info(`Success: Loaded data from ${dataSource}`);
    return <DataType>data;
};

export const loadGames = async (dataSource: string, payload: { gameType: string }): Promise<Types.OnePlayerGames | Types.TwoPlayerGames | undefined> => (payload.gameType === "puzzles" ? await loadData<Types.OnePlayerGames>(dataSource) : await loadData<Types.TwoPlayerGames>(dataSource));

export const loadVariants = async (dataSource: string, payload: { gameType: string }): Promise<Types.OnePlayerGameVariants | Types.TwoPlayerGameVariants | undefined> => (payload.gameType === "puzzles" ? await loadData<Types.OnePlayerGameVariants>(dataSource) : await loadData<Types.TwoPlayerGameVariants>(dataSource));

export const loadPosition = async (dataSource: string) => await loadData<Types.Position>(dataSource);
