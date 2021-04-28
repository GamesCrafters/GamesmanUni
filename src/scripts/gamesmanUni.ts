import { loadRawGames, loadRawGameVariants, loadRawGamePosition } from "./apis/gamesCrafters";
import type { RawOnePlayerGameVariantsData } from "./apis/gamesCrafters";
import { loadRawLatestCommitHistoryData } from "./apis/gitHub";
import type * as gamesmanUniTypes from "./gamesmanUniTypes";

export async function loadGames(app: gamesmanUniTypes.AppData, type: string): Promise<gamesmanUniTypes.AppGamesData | undefined> {
    let gamesDataSource: string;
    if (type === "puzzles") {
        gamesDataSource = `${app.externalDataSources.onePlayerGamesDataSource}`;
    } else {
        gamesDataSource = `${app.externalDataSources.twoPlayersGamesDataSource}`;
    }
    const rawGames = await loadRawGames(gamesDataSource);
    if (!rawGames) {
        console.error(`Error: Failed to load raw ${type} data.`);
        return undefined;
    }
    const games: gamesmanUniTypes.AppGamesData = rawGames.response.map((rawGame) => ({
        author: app.game.author,
        description: app.game.description,
        id: rawGame.gameId,
        name: rawGame.name,
        options: app.game.options,
        status: rawGame.status,
        type: type,
        variant: app.game.variant,
        variants: app.game.variants,
    }));
    return games;
}

export async function loadGameVariants(app: gamesmanUniTypes.AppData, type: string, gameId: string): Promise<gamesmanUniTypes.AppGameData | undefined> {
    let gameVariantsDataSource: string;
    if (type === "puzzles") {
        gameVariantsDataSource = `${app.externalDataSources.onePlayerGamesDataSource}/${gameId}`;
    } else {
        gameVariantsDataSource = `${app.externalDataSources.twoPlayersGamesDataSource}/${gameId}`;
    }
    const rawGameVariants = await loadRawGameVariants(gameVariantsDataSource);
    if (!rawGameVariants) {
        console.error(`Error: Failed to load raw ${gameId} variants data.`);
        return undefined;
    }
    let game: gamesmanUniTypes.AppGameData = app.game;
    if (type === "puzzles") {
        game.author = (<RawOnePlayerGameVariantsData>rawGameVariants).response.author;
        game.description = (<RawOnePlayerGameVariantsData>rawGameVariants).response.description;
    }
    game.id = rawGameVariants.response.gameId;
    game.name = rawGameVariants.response.name;
    game.type = type;
    game.variants = rawGameVariants.response.variants.map((rawGameVariant) => ({
        description: rawGameVariant.description,
        id: rawGameVariant.variantId,
        startPosition: rawGameVariant.startPosition,
        status: rawGameVariant.status,
    }));
    return game;
}

export async function loadLatestCommitHistory(app: gamesmanUniTypes.AppData) {
    const gitHubCommitDataSource = `${app.externalDataSources.gamesmanUniGitHubRepositoryDataSource}/commits`;
    const rawLatestCommitHistoryData = await loadRawLatestCommitHistoryData(gitHubCommitDataSource);
    if (!rawLatestCommitHistoryData) {
        console.error(`Error: Failed to load raw latest commit history data.`);
        return undefined;
    }
    const latestCommitHistoryData: gamesmanUniTypes.AppLatestCommitHistoryData = rawLatestCommitHistoryData.map((rawCommitData) => ({
        authorAvatarUrl: <string>rawCommitData.author?.avatar_url,
        authorName: <string>rawCommitData.commit.author?.name,
        authorUrl: <string>rawCommitData.author?.html_url,
        authorUsername: <string>rawCommitData.author?.login,
        date: <string>rawCommitData.commit.author?.date,
        message: rawCommitData.commit.message,
        sha: rawCommitData.sha,
        url: rawCommitData.html_url,
    }));
    return latestCommitHistoryData;
}
