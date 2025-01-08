import { ImageAutoGUIData } from "../apis/gamesCrafters/types";

export type Update = {
    status: string;
    lastUpdated: number;
};

export type App = Update & {
    version: string;
    preferences: Preferences;
    dataSources: DataSources;
    games: Record<string, Game>;
    commits: Commits;
    options: Options;
    matches: Matches;
    currentMatch: Match;
    vvhView: string;
    CPUsStrategy: string[];
};

export type Player = {
    name: string;
    isComputer: boolean;
}

export type Preferences = {
    theme: string;
    locale: string;
    fallbackLocale: string;
    rootFontSize: string;
    volume: number;
    ambienceVolume: number;
};

export type DataSources = {
    gitHubRepositoryAPI: string;
    gameAPI: string;
};

export type Game = {
    id: string;
    name: string;
    instructions: Record<string, string>;
    type: string;
    variants: Record<string, Variant>;
    gui: string;
    allowCustomVariantCreation: boolean;
    supportsWinBy: boolean;
};

export type Variant = {
    id: string;
    name: string;
    startPosition: string;
    autoguiStartPosition: string;
    positions: Positions;
    imageAutoGUIData: ImageAutoGUIData;
    gui: string;
};

export type Positions = Record<string, Position>;

export type Position = {
    moveToAutoguiMove: MoveNames;
    availableMoves: Moves;
    position: string;
    autoguiPosition: string;
    positionValue: string;
    remoteness: number;
    winby: number;
    mex: string;
    drawLevel: number;
    drawRemoteness: number;
};

export type Moves = Record<string, Move>;

export type MoveNames = Record<string, string>;

export type Move = {
    deltaRemoteness: number;
    move: string;
    autoguiMove: string;
    moveValue: string;
    moveValueOpacity: number;
    position: string;
    autoguiPosition: string;
    positionValue: string;
    remoteness: number;
    winby: number;
    mex: string;
    drawLevel: number;
    drawRemoteness: number;
};

export type Commits = Update & {
    commits: Record<string, Commit>;
};

export type Commit = {
    date: string;
    message: string;
    sha: string;
    url: string;
    authorName: string;
    authorUsername: string;
    authorAvatarUrl: string;
    authorGitHubUrl: string;
};

export type Options = {
    automoveIfSingleMove: boolean;
    computerMoveDuration: number;
    showInstructions: boolean;
    showNextMoveDeltaRemotenesses: boolean;
    showNextMoveHints: boolean;
    showNextMoves: boolean;
    showOptions: boolean;
    showMenu: boolean;
    showVvhGuides: boolean;
    showVvhMeters: boolean;
    vvhScrolling: boolean;
};

export type Matches = Record<number, Match>;

export type Match = {
    id: number;
    gameType: string;
    gameId: string;
    gameTheme: string;
    variantId: string;
    startPosition: string;
    autoguiStartPosition: string;
    firstPlayer: Player;
    secondPlayer: Player;
    rounds: Rounds;
    moveHistory: string;
    round: Round;
    // created: number;
    // lastPlayed: number;
    backgroundLoading: boolean;
    computerMoving: boolean;
    animationPlaying: boolean;
};

export type Rounds = Array<Round>;

export type Round = {
    id: number;
    firstPlayerTurn: boolean;
    move: string;
    autoguiMove: string;
    moveValue: string;
    position: Position;
};
