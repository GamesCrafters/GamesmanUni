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
        history: app.game.history,
        id: rawGame.gameId,
        name: rawGame.name,
        options: app.game.options,
        round: app.game.round,
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
    game.id = gameId;
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

export async function loadGamePosition(app: gamesmanUniTypes.AppData, type: string, gameId: string, variantId: string, position: string): Promise<gamesmanUniTypes.AppGameData | undefined> {
    let gamePositionDataSource: string;
    if (type === "puzzles") {
        gamePositionDataSource = `${app.externalDataSources.onePlayerGamesDataSource}/${gameId}/variants/${variantId}/positions/${position}`;
    } else {
        gamePositionDataSource = `${app.externalDataSources.twoPlayersGamesDataSource}/${gameId}/variants/${variantId}/positions/${position}`;
    }
    const rawGamePosition = await loadRawGamePosition(gamePositionDataSource);
    if (!rawGamePosition) {
        console.error(`Error: Failed to load raw ${gameId} position data.`);
        return undefined;
    }
    let game: gamesmanUniTypes.AppGameData = app.game;
    if (game.round.id) {
        game.history[game.history.length - 1] = game.round;
    }
    game.round.availableMoves = rawGamePosition.response.moves.map((nextMove) => ({
        deltaRemoteness: nextMove.deltaRemoteness,
        move: nextMove.move,
        moveValue: nextMove.moveValue,
        position: nextMove.position,
        positionValue: nextMove.positionValue,
        remoteness: nextMove.remoteness,
        moveValueOpacity: 0,
    }));
    game.round.id += 1;
    game.round.move = "";
    game.round.moveValue = "";
    game.round.position = rawGamePosition.response.position;
    game.round.positionValue = rawGamePosition.response.positionValue;
    game.round.remoteness = rawGamePosition.response.remoteness;
    game.history.push(game.round);
    return game;
}

export function undoMove(game: gamesmanUniTypes.AppGameData): gamesmanUniTypes.AppGameData {
    game.round = game.history.find((round) => round.id === game.round.id - 1)!;
    return game;
}

export function redoMove(game: gamesmanUniTypes.AppGameData): gamesmanUniTypes.AppGameData {
    game.round = game.history.find((round) => round.id === game.round.id + 1)!;
    return game;
}

export async function loadLatestCommitHistory(app: gamesmanUniTypes.AppData): Promise<gamesmanUniTypes.AppLatestCommitHistoryData | undefined> {
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
