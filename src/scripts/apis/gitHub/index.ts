import axios from "axios";
import * as Types from "./types";

export const loadLatestCommits = async (dataSource: string) => {
    let latestCommits: Types.LatestCommits;
    try {
        latestCommits = (await axios.get(dataSource)).data;
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load data from ${dataSource}.`);
        return undefined;
    }
    console.info(`Success: Loaded data from ${dataSource}.`);
    return latestCommits;
};
