import type * as Types from "../../scripts/gamesmanUni/types";
import { ImageAutoGUITheme } from "../../scripts/apis/gamesCrafters/types";

const defaultUpdate: Types.Update = {
    status: "",
    lastUpdated: 0,
};

export const defaultPreferences: Types.Preferences = {
    theme: "light",
    locale: "en-US",
    fallbackLocale: "en-US",
    rootFontSize: "11",
    volume: 1,
    ambienceVolume: 1
};

export const defaultDataSources: Types.DataSources = {
    gitHubRepositoryAPI: "https://api.github.com/repos/GamesCrafters/GamesmanUni",
    //gameAPI: "https://nyc.cs.berkeley.edu/universal/v1/"
    gameAPI: "http://localhost:8082/"
};

export const defaultAvailableMove: Types.Move = {
    move: "",
    autoguiMove: "",
    position: "",
    autoguiPosition: "",
    deltaRemoteness: 0,
    moveValue: "",
    moveValueOpacity: 1,
    positionValue: "",
    remoteness: 0,
    winby: 0,
    mex: "",
    drawLevel: -1,
    drawRemoteness: -1
};

export const defaultMoveToAutoguiMove: Types.MoveNames = {};

export const defaultPosition: Types.Position = {
    ...defaultUpdate,
    moveToAutoguiMove: {},
    availableMoves: {},
    position: "",
    autoguiPosition: "",
    positionValue: "",
    remoteness: 0,
    mex: "",
    winby: 0,
    drawLevel: -1,
    drawRemoteness: -1
};

export const defaultPositions: Types.Positions = {};

export const defaultVariant: Types.Variant = {
    id: "",
    name: "",
    gui: "v0",
    startPosition: "",
    autoguiStartPosition: "",
    imageAutoGUIData: null as any,
    positions: {},
};

export const defaultImageAutoGUITheme: ImageAutoGUITheme = {
    space: [1, 1],
    centers: [[]],
    background: '',
    foreground: '',
    charImages: {},
    textEntityFontSize: 1,
    circleButtonRadius: 1,
    lineWidth: 1,
    arrowWidth: 1,
    textButtonFontSize: 1,
    entitiesOverArrows: false,
    sounds: {},
    animationType: '',
    defaultAnimationWindow: [0, 1]
}

export const defaultGame: Types.Game = {
    id: "",
    name: "",
    instructions: {},
    type: "",
    variants: {},
    allowCustomVariantCreation: false,
    gui: "v0",
    supportsWinBy: false,
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
    automoveIfSingleMove: false,
    computerMoveDuration: 1000,
    showInstructions: false,
    showNextMoveDeltaRemotenesses: true,
    showNextMoveHints: true,
    showNextMoves: true,
    showOptions: false,
    showMenu: true,
    showViewsInstructions: false,
    vvhScrolling: false,
    showScorecard: false,
    highlightMove: true,
};

export const defaultMatches: Types.Matches = {};

export const defaultRounds: Types.Rounds = [];

export const defaultRound: Types.Round = {
    id: 0,
    firstPlayerTurn: true,
    move: "",
    autoguiMove: "",
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
    autoguiStartPosition: "",
    firstPlayer: {name: "Player 1", isComputer: false},
    secondPlayer: {name: "Player 2", isComputer: false},
    rounds: [],
    moveHistory: "",
    round: { ...defaultRound, position: { ...defaultPosition, availableMoves: {} } },
    backgroundLoading: false,
    computerMoving: false,
    animationPlaying: false
};

export const VVHViews: Array<string> = ["Remoteness", "Win By", "Draw Level", "Column"];
export const activeVVHViews: Array<Types.VVHView> = [{name: VVHViews[0], viewOptions: {togglePreferences: false, toggleScrolling: false, toggleGuides: true}}]; //VVHViews[0] is set as the default view.

export const CPUStrategies: Array<string> = ["Remoteness", "Win By", "Skill Expression"];
export const defaultCPUsStrategies: Array<string> = ["Remoteness", "Remoteness"];
export const defaultCPUsRatings: Array<number> = [0, 0];

export const defaultApp: Types.App = {
    ...defaultUpdate,
    version: <string>import.meta.env.PACKAGE_VERSION || "",
    preferences: { ...defaultPreferences },
    dataSources: { ...defaultDataSources },
    games: {},
    commits: { ...defaultUpdate, commits: {} },
    options: { ...defaultOptions },
    matches: {},
    activeVVHViews: activeVVHViews,
    currentMatch: {
        id: 0, gameType: "",
        gameId: "",
        variantId: "",
        gameTheme: "",
        startPosition: "",
        autoguiStartPosition: "",
        firstPlayer: {name: "Player 1", isComputer: false},
        secondPlayer: {name: "Player 2", isComputer: false},
        rounds: [],
        moveHistory: "",
        animationPlaying: false,
        round: {
            ...defaultRound,
            position: { ...defaultPosition, availableMoves: {} } },
            backgroundLoading: false,
            computerMoving: false
    },
    CPUsStrategies: [...defaultCPUsStrategies],
    CPUsRatings: [...defaultCPUsRatings],
    scorecard: {
        totalWins: 0,
        playerWinsMap: new Map(),
        records: [],
    },
    highlightedMove: '',
};
