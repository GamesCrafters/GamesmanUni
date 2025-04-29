import axios from "axios";
import type * as Types from "./types";

export const loadData = async <DataType>(dataSource: string) => {
    let data;
    try {
        data = (await axios.get(dataSource)).data;
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load data from ${dataSource}.`);
        return undefined;
    }
    if (typeof data === "object" && "error" in data) {
        console.error((<Types.Error>data).error);
        console.error(`Error: Returned error from ${dataSource}`);
        return undefined;
    }
    console.info(`Success: Loaded data from ${dataSource}`);
    return <DataType>data;
};

export const loadInstructions = async (dataSource: string): Promise<Types.Instructions | undefined> => await loadData<Types.Instructions>(dataSource);

export const loadGames = async (dataSource: string): Promise<Types.Games | undefined> => await loadData<Types.Games>(dataSource);

export const loadGame = async (dataSource: string): Promise<Types.Game | undefined> => await loadData<Types.Game>(dataSource);

export const loadVariant = async (dataSource: string): Promise<Types.Variant | undefined> => await loadData<Types.Variant>(dataSource);

export const loadPosition = async (dataSource: string) => await loadData<Types.Position>(dataSource);