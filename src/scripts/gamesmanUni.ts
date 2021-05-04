import { loadRawGames, loadRawGameVariants, loadRawGamePosition } from "./apis/gamesCrafters";
import type { RawOnePlayerGameVariantsData } from "./apis/gamesCrafters";
import { loadRawLatestCommitHistoryData } from "./apis/gitHub";
import type * as gamesmanUniTypes from "./gamesmanUniTypes";

export async function loadGames(app: gamesmanUniTypes.AppData, type: string): Promise<gamesmanUniTypes.AppData | undefined> {
    const gamesDataSource: string = type === "puzzles" ? `${app.externalDataSources.onePlayerGamesDataSource}` : `${app.externalDataSources.twoPlayersGamesDataSource}`;
    const rawGames = await loadRawGames(gamesDataSource);
    if (!rawGames) {
        console.error(`Error: Failed to load raw ${type} data.`);
        return undefined;
    }
    app.games = rawGames.response.map((rawGame) => ({
        author: app.game.author,
        description: app.game.description,
        history: app.game.history,
        id: rawGame.gameId,
        name: rawGame.name,
        options: app.game.options,
        players: app.game.players,
        round: app.game.round,
        status: rawGame.status,
        turn: app.game.turn,
        type: type,
        variant: app.game.variant,
        variants: app.game.variants,
    }));
    return app;
}

export async function loadGameVariants(app: gamesmanUniTypes.AppData, type: string, gameId: string): Promise<gamesmanUniTypes.AppData | undefined> {
    const gameVariantsDataSource: string = type === "puzzles" ? `${app.externalDataSources.onePlayerGamesDataSource}/${gameId}` : `${app.externalDataSources.twoPlayersGamesDataSource}/${gameId}`;
    const rawGameVariants = await loadRawGameVariants(gameVariantsDataSource);
    if (!rawGameVariants) {
        console.error(`Error: Failed to load raw ${gameId} variants data.`);
        return undefined;
    }
    if (type === "puzzles") {
        app.game.author = (<RawOnePlayerGameVariantsData>rawGameVariants).response.author;
        app.game.description = (<RawOnePlayerGameVariantsData>rawGameVariants).response.description;
    }
    app.game.id = gameId;
    app.game.name = rawGameVariants.response.name;
    (app.game.players =
        type === "puzzles"
            ? [{ id: "player", name: "Player" }]
            : [
                  { id: "left", name: "Left Player" },
                  { id: "right", name: "Right Player" },
              ]),
        (app.game.type = type);
    app.game.variants = rawGameVariants.response.variants.map((rawGameVariant) => ({
        description: rawGameVariant.description,
        id: rawGameVariant.variantId,
        startPosition: rawGameVariant.startPosition,
        status: rawGameVariant.status,
    }));
    return app;
}

async function loadGamePosition(app: gamesmanUniTypes.AppData, type: string, gameId: string, variantId: string, position: string): Promise<gamesmanUniTypes.AppData | undefined> {
    const gamePositionDataSource: string = type === "puzzles" ? `${app.externalDataSources.onePlayerGamesDataSource}/${gameId}/variants/${variantId}/positions/${position}` : `${app.externalDataSources.twoPlayersGamesDataSource}/${gameId}/variants/${variantId}/positions/${position}`;
    const rawGamePosition = await loadRawGamePosition(gamePositionDataSource);
    if (!rawGamePosition) {
        console.error(`Error: Failed to load raw ${gameId} position data.`);
        return undefined;
    }
    app.game.round.availableMoves = [];
    if (rawGamePosition.response.moves.length) {
        app.game.round.availableMoves.push({
            deltaRemoteness: rawGamePosition.response.moves[0].deltaRemoteness,
            move: rawGamePosition.response.moves[0].move,
            moveValue: rawGamePosition.response.moves[0].moveValue,
            position: rawGamePosition.response.moves[0].position,
            positionValue: rawGamePosition.response.moves[0].positionValue,
            remoteness: rawGamePosition.response.moves[0].remoteness,
            moveValueOpacity: 1,
        });
    }
    for (let i: number = 1; i < rawGamePosition.response.moves.length; i++) {
        app.game.round.availableMoves.push({
            deltaRemoteness: rawGamePosition.response.moves[i].deltaRemoteness,
            move: rawGamePosition.response.moves[i].move,
            moveValue: rawGamePosition.response.moves[i].moveValue,
            position: rawGamePosition.response.moves[i].position,
            positionValue: rawGamePosition.response.moves[i].positionValue,
            remoteness: rawGamePosition.response.moves[i].remoteness,
            moveValueOpacity: 1,
        });
        if (app.game.round.availableMoves[i].moveValue != app.game.round.availableMoves[i - 1].moveValue) {
            app.game.round.availableMoves[i].moveValueOpacity = 1;
            continue;
        }
        if (app.game.round.availableMoves[i - 1].moveValueOpacity === 0.5) {
            app.game.round.availableMoves[i].moveValueOpacity = 0.5;
            continue;
        }
        if (rawGamePosition.response.moves[i].deltaRemoteness != rawGamePosition.response.moves[i - 1].deltaRemoteness) {
            app.game.round.availableMoves[i].moveValueOpacity = app.game.round.availableMoves[i - 1].moveValueOpacity - 0.25;
        } else {
            app.game.round.availableMoves[i].moveValueOpacity = app.game.round.availableMoves[i - 1].moveValueOpacity;
        }
    }
    app.game.round.position = rawGamePosition.response.position;
    app.game.round.positionValue = rawGamePosition.response.positionValue;
    app.game.round.remoteness = rawGamePosition.response.remoteness;
    return app;
}

export async function initiateGame(app: gamesmanUniTypes.AppData, type: string, gameId: string, variantId: string): Promise<gamesmanUniTypes.AppData | undefined> {
    app.game.turn = 1;
    app.game.variant = app.game.variants.find((variant) => variant.id === variantId)!;
    const updatedApp = await loadGamePosition(app, type, gameId, variantId, app.game.variant.startPosition);
    if (!updatedApp) {
        console.error(`Error: Failed to load game data.`);
        return undefined;
    }
    app.game.round.availableMoves = updatedApp.game.round.availableMoves;
    app.game.round.id = 1;
    app.game.round.player = app.game.players[app.game.turn - 1];
    app.game.round.position = app.game.variant.startPosition;
    app.game.round.positionValue = updatedApp.game.round.positionValue;
    app.game.round.remoteness = updatedApp.game.round.remoteness;
    app.game.history = [app.game.round];
    return app;
}

export function restartGame(app: gamesmanUniTypes.AppData): gamesmanUniTypes.AppData {
    app.game.turn = 1;
    app.game.round.availableMoves = app.game.history[0].availableMoves;
    app.game.round.id = 1;
    app.game.round.move = "";
    app.game.round.moveValue = "";
    app.game.round.player = app.game.players[0];
    app.game.round.position = app.game.history[0].position;
    app.game.round.positionValue = app.game.history[0].positionValue;
    app.game.round.remoteness = app.game.history[0].remoteness;
    app.game.history = [app.game.round];
    return app;
}

export async function runMove(app: gamesmanUniTypes.AppData, move: string): Promise<gamesmanUniTypes.AppData | undefined> {
    const moveData = app.game.round.availableMoves.find((availableMove) => availableMove.move === app.game.round.move)!;
    app.game.round.move = move;
    app.game.round.moveValue = moveData.moveValue;
    app.game.history[app.game.round.id - 1] = app.game.round;
    app.game.turn = app.game.type === "puzzles" ? 1 : app.game.turn === 1 ? 2 : 1;
    const updatedApp = await loadGamePosition(app, app.game.type, app.game.id, app.game.variant.id, moveData.position);
    if (!updatedApp) {
        console.error(`Error: Failed to load game data.`);
        return undefined;
    }
    app.game.round.availableMoves = updatedApp.game.round.availableMoves;
    app.game.round.id += 1;
    app.game.round.move = "";
    app.game.round.moveValue = "";
    app.game.round.player = app.game.players[app.game.turn - 1];
    app.game.round.position = updatedApp.game.round.position;
    app.game.round.positionValue = updatedApp.game.round.positionValue;
    app.game.round.remoteness = updatedApp.game.round.remoteness;
    app.game.history = [app.game.round];
    return app;
}

export function undoMove(app: gamesmanUniTypes.AppData): gamesmanUniTypes.AppData {
    app.game.round = app.game.history.find((round) => round.id === app.game.round.id - 1)!;
    return app;
}

export function redoMove(app: gamesmanUniTypes.AppData): gamesmanUniTypes.AppData {
    app.game.round = app.game.history.find((round) => round.id === app.game.round.id + 1)!;
    return app;
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
