import type { AppData } from "../../scripts/gamesmanUniTypes";

export const defaultApp: AppData = {
    externalDataSources: {
        gamesmanUniGitHubRepositoryDataSource: "https://api.github.com/repos/GamesCrafters/GamesmanUni",
        onePlayerGamesDataSource: "https://nyc.cs.berkeley.edu/puzzles",
        twoPlayersGamesDataSource: "https://nyc.cs.berkeley.edu/universal/v1/games",
    },
    game: {
        author: "",
        description: "",
        history: [],
        id: "",
        name: "",
        options: {
            showDateTime: false,
            showInstruction: false,
            showNextMoves: true,
            showNextMoveDeltaRemotenesses: true,
            showNextMoveHints: true,
            showOptions: false,
            showStopWatch: false,
            showVisualValueHistory: true,
        },
        round: {
            availableMoves: [],
            id: 0,
            move: "",
            moveValue: "",
            position: "",
            positionValue: "",
            remoteness: Number.POSITIVE_INFINITY,
        },
        status: "",
        type: "",
        variant: {
            description: "",
            id: "",
            status: "",
            startPosition: "",
        },
        variants: [],
    },
    games: [],
    latestCommitHistory: [],
    preferences: {
        theme: "light",
        locale: "en",
        fallbackLocale: "en",
    },
    version: <string>import.meta.env.PACKAGE_VERSION,
};
