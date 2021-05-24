import type * as Types from "../../scripts/gamesmanUni/types";

const defaultUpdate: Types.Update = {
    status: "",
    lastUpdated: 0,
};

export const defaultPreferences: Types.Preferences = {
    theme: "light",
    locale: "en",
    fallbackLocale: "en",
    rootFontSize: "16px",
};

export const defaultDataSources: Types.DataSources = {
    gitHubRepositoryAPI: "https://api.github.com/repos/GamesCrafters/GamesmanUni",
    onePlayerGameAPI: "https://nyc.cs.berkeley.edu/puzzles",
    twoPlayerGameAPI: "https://nyc.cs.berkeley.edu/universal/v1/games",
};

export const defaultAvailableMove: Types.Move = {
    deltaRemoteness: 0,
    move: "",
    moveValue: "",
    moveValueOpacity: 1,
    position: "",
    positionValue: "",
    remoteness: 0,
};

export const defaultAvailableMoves: Types.Moves = {};

export const defaultPosition: Types.Position = {
    ...defaultUpdate,
    availableMoves: { ...defaultAvailableMoves },
    position: "",
    positionValue: "",
    remoteness: 0,
};

export const defaultPositions: Types.Positions = {};

export const defaultVariant: Types.Variant = {
    id: "",
    description: "",
    startPosition: "",
    positions: { ...defaultPositions },
    status: "",
};

export const defaultVariants: Types.Variants = {
    ...defaultUpdate,
    variants: {},
};

export const defaultGame: Types.Game = {
    id: "",
    name: "",
    author: "",
    description: "",
    dateCreated: "",
    instructions: "",
    type: "",
    variants: { ...defaultVariants },
    status: "",
};

export const defaultGames: Types.Games = {
    ...defaultUpdate,
    games: {},
};

export const defaultGameTypes: Types.GameTypes = {
    puzzles: { ...defaultUpdate, games: {} },
    games: { ...defaultUpdate, games: {} },
};

export const defaultCommit: Types.Commit = {
    date: "",
    message: "",
    sha: "",
    url: "",
    authorName: "",
    authorUsername: "",
    authorAvatarUrl: "",
    authorGitHubUrl: "",
};

export const defaultCommits: Types.Commits = {
    ...defaultUpdate,
    commits: {},
};

export const defaultOptions: Types.Options = {
    showInstructions: false,
    showNextMoveDeltaRemotenesses: true,
    showNextMoveHints: true,
    showNextMoves: true,
    showOptions: false,
    showVvh: true,
    showVvhGuides: true,
    showVvhMeters: false,
};

export const defaultMatches: Types.Matches = {};

export const defaultRounds: Types.Rounds = {};

export const defaultRound: Types.Round = {
    id: 0,
    playerId: "",
    move: "",
    moveValue: "",
    position: { ...defaultPosition },
};

export const defaultMatch: Types.Match = {
    id: 0,
    gameType: "",
    gameId: "",
    variantId: "",
    type: "",
    players: [],
    startingPlayerId: "",
    rounds: { ...defaultRounds },
    round: { ...defaultRound },
    turn: 0,
    created: 0,
    lastPlayed: 0,
    ended: 0,
};

export const defaultUser: Types.User = {
    id: "string",
    name: "string",
    options: { ...defaultOptions },
    matches: { ...defaultMatches },
};

export const defaultUsers: Types.Users = {
    p1: {
        id: "p1",
        name: "Player 1",
        options: { ...defaultOptions },
        matches: { ...defaultMatches },
    },
    p2: {
        id: "p2",
        name: "Player 2",
        options: { ...defaultOptions },
        matches: { ...defaultMatches },
    },
    c1: {
        id: "c1",
        name: "Computer 1",
        options: { ...defaultOptions },
        matches: { ...defaultMatches },
    },
    c2: {
        id: "c2",
        name: "Computer 2",
        options: { ...defaultOptions },
        matches: { ...defaultMatches },
    },
};

export const defaultApp: Types.App = {
    ...defaultUpdate,
    version: <string>import.meta.env.PACKAGE_VERSION || "",
    preferences: { ...defaultPreferences },
    dataSources: { ...defaultDataSources },
    gameTypes: { ...defaultGameTypes },
    commits: { ...defaultCommits },
    users: { ...defaultUsers },
    currentMatch: { ...defaultMatch },
};
