import axios from "axios";

type RawErrorData = {
    error: string;
    status: "error";
};

export type RawGamesData = {
    response: Array<{
        gameId: string;
        name: string;
        status: string;
    }>;
    status: "ok";
};

export type RawOnePlayerGameVariantsData = {
    response: {
        author: string;
        dateCreated: string;
        description: string;
        gameId: string;
        name: string;
        variants: Array<{
            description: string;
            startPosition: string;
            status: string;
            variantId: string;
        }>;
    };
    status: "ok";
};

export type RawTwoPlayersGameVariantsData = {
    response: {
        gameId: string;
        instructions: string;
        name: string;
        variants: Array<{
            description: string;
            startPosition: string;
            status: string;
            variantId: string;
        }>;
    };
    status: "ok";
};

export type RawPositionData = {
    response: {
        moves: Array<{
            deltaRemoteness: number;
            move: string;
            moveValue: string;
            position: string;
            positionValue: string;
            remoteness: number;
        }>;
        position: string;
        positionValue: string;
        remoteness: number;
    };
    status: "ok";
};

export async function loadRawGames(rawGamesDataSource: string): Promise<RawGamesData | undefined> {
    let rawGamesData: RawGamesData | RawErrorData;
    try {
        const httpResponse = await axios.get(rawGamesDataSource);
        rawGamesData = httpResponse.data;
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load raw data from ${rawGamesDataSource}.`);
        return undefined;
    }
    if (rawGamesData.status === "error") {
        console.error((<RawErrorData>rawGamesData).error);
        console.error(`Error: Connected to ${rawGamesDataSource} but got error.`);
        return undefined;
    }
    console.info(`Successfully loaded raw data from ${rawGamesDataSource}.`);
    return rawGamesData;
}

export async function loadRawGameVariants(rawVariantsDataSource: string): Promise<RawOnePlayerGameVariantsData | RawTwoPlayersGameVariantsData | undefined> {
    let rawVariantsData: RawOnePlayerGameVariantsData | RawTwoPlayersGameVariantsData | RawErrorData;
    try {
        const httpResponse = await axios.get(rawVariantsDataSource);
        rawVariantsData = httpResponse.data;
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load raw data from ${rawVariantsDataSource}.`);
        return undefined;
    }
    if (rawVariantsData.status === "error") {
        console.error((<RawErrorData>rawVariantsData).error);
        console.error(`Error: Connected to ${rawVariantsDataSource} but got error.`);
        return undefined;
    }
    console.info(`Successfully loaded raw data from ${rawVariantsDataSource}.`);
    return rawVariantsData;
}

export async function loadRawGamePosition(rawPositionDataSource: string): Promise<RawPositionData | undefined> {
    let rawPositionData: RawPositionData | RawErrorData;
    try {
        const httpResponse = await axios.get(rawPositionDataSource);
        rawPositionData = httpResponse.data;
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load raw data from ${rawPositionDataSource}`);
        return undefined;
    }
    if (rawPositionData.status === "error") {
        console.error((<RawErrorData>rawPositionData).error);
        console.error(`Error: Connected to ${rawPositionDataSource} but got error.`);
        return undefined;
    }
    console.info(`Successfully loaded raw data from ${rawPositionDataSource}`);
    return rawPositionData;
}
