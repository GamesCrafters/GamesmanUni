import type * as Types from "../../scripts/gamesmanUni/types";

const defaultUpdate: Types.Update = {
    status: "",
    lastUpdated: 0,
};

export const defaultPreferences: Types.Preferences = {
    theme: "light",
    locale: "en-US",
    fallbackLocale: "en-US",
    rootFontSize: "11px",
};

export const defaultDataSources: Types.DataSources = {
    gitHubRepositoryAPI: "https://api.github.com/repos/GamesCrafters/GamesmanUni",
    onePlayerGameAPI: "https://nyc.cs.berkeley.edu/puzzles",
    // onePlayerGameAPI: "http://localhost:9001/",
    //twoPlayerGameAPI: "https://nyc.cs.berkeley.edu/universal/v1/games",
    twoPlayerGameAPI: "http://localhost:8082/games"
};

export const defaultAvailableMove: Types.Move = {
    deltaRemoteness: 0,
    move: "",
    moveName: "",
    moveValue: "",
    moveValueOpacity: 1,
    position: "",
    positionValue: "",
    remoteness: 0,
    mex: ""
};

export const defaultAvailableMoveNames: Types.MoveNames = {};

export const defaultAvailableMoves: Types.Moves = {};

export const defaultPosition: Types.Position = {
    ...defaultUpdate,
    availableMoveNames: {},
    availableMoves: {},
    position: "",
    positionValue: "",
    remoteness: 0,
    mex: ""
};

export const defaultPositions: Types.Positions = {};

export const defaultVariant: Types.Variant = {
    id: "",
    description: "",
    startPosition: "",
    positions: {},
    autogui_v2_data: null as any,
    status: "",
    gui_status: "v0"
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
    variants: { ...defaultVariants, variants: {} },
    status: "",
    custom: false,
    gui_status: "v0"
};

export const defaultGames: Types.Games = {
    ...defaultUpdate,
    games: {},
};

export const defaultGameTypes: Types.GameTypes = {
    puzzles: { ...defaultGames, games: {} },
    games: { ...defaultGames, games: {} },
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
    computerMoveDuration: 1000,
    showInstructions: false,
    showNextMoveDeltaRemotenesses: true,
    showNextMoveHints: true,
    showNextMoves: true,
    showOptions: false,
    showMenu: true,
    showVvhGuides: true,
    showVvhMeters: false,
    vvhScrolling: false
};

export const defaultMatches: Types.Matches = {};

export const defaultRounds: Types.Rounds = [];

export const defaultRound: Types.Round = {
    id: 0,
    firstPlayerTurn: true,
    move: "",
    moveName: "",
    moveValue: "",
    position: { ...defaultPosition, availableMoves: {} },
};

export const defaultMatch: Types.Match = {
    id: 0,
    gameType: "",
    gameId: "",
    gameTheme: "",
    variantId: "",
    startPosition: "",
    firstPlayer: {name: "Player 1", isComputer: false},
    secondPlayer: {name: "Player 2", isComputer: false},
    rounds: [],
    moveHistory: "",
    round: { ...defaultRound, position: { ...defaultPosition, availableMoves: {} } },
    created: 0,
    lastPlayed: 0,
    backgroundLoading: false,
    computerMoving: false
};

export const defaultApp: Types.App = {
    ...defaultUpdate,
    version: <string>import.meta.env.PACKAGE_VERSION || "",
    preferences: { ...defaultPreferences },
    dataSources: { ...defaultDataSources },
    gameTypes: { puzzles: { ...defaultGames, games: {} }, games: { ...defaultGames, games: {} } },
    commits: { ...defaultUpdate, commits: {} },
    options: { ...defaultOptions },
    matches: {},
    currentMatch: {
        id: 0, gameType: "",
        gameId: "",
        variantId: "",
        gameTheme: "",
        startPosition: "",
        firstPlayer: {name: "Player 1", isComputer: false},
        secondPlayer: {name: "Player 2", isComputer: false},
        rounds: [],
        moveHistory: "",
        round: {
            ...defaultRound,
            position: { ...defaultPosition, availableMoves: {} } },
            created: 0,
            lastPlayed: 0,
            backgroundLoading: false,
            computerMoving: false
    },
};
