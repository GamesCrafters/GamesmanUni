import axios from "axios";
import { Endpoints } from "@octokit/types";

export type RawLatestCommitHistoryData = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];

export async function loadRawLatestCommitHistoryData(rawLatestCommitHistoryDataSource: string): Promise<RawLatestCommitHistoryData | undefined> {
    let rawLatestCommitHistoryData: RawLatestCommitHistoryData;
    try {
        const httpResponse = await axios.get(rawLatestCommitHistoryDataSource);
        rawLatestCommitHistoryData = Object.values(httpResponse.data);
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load raw commit history data from ${rawLatestCommitHistoryDataSource}.`);
        return undefined;
    }
    console.info(`Successfully loaded raw commit history data from ${rawLatestCommitHistoryDataSource}.`);
    return rawLatestCommitHistoryData;
}
