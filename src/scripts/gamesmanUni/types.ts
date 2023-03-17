export type Update = {
    status: string;
    lastUpdated: number;
};

export type App = Update & {
    version: string;
    preferences: Preferences;
    dataSources: DataSources;
    gameTypes: GameTypes;
    commits: Commits;
    options: Options;
    matches: Matches;
    currentMatch: Match;
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
};

export type DataSources = {
    gitHubRepositoryAPI: string;
    onePlayerGameAPI: string;
    twoPlayerGameAPI: string;
};

export type GameTypes = Record<string, Games>;

export type Games = Update & {
    games: Record<string, Game>;
};

export type Game = {
    id: string;
    name: string;
    author: string;
    description: string;
    dateCreated: string;
    instructions: string;
    type: string;
    variants: Variants;
    status: string;
    gui_status: string;
    custom: boolean;
};

export type Variants = Update & {
    variants: Record<string, Variant>;
};

export type Variant = {
    id: string;
    description: string;
    startPosition: string;
    positions: Positions;
    autogui_v2_data: object;
    status: string;
    gui_status: string;
};

export type Positions = Record<string, Position>;

export type Position = Update & {
    availableMoveNames: MoveNames;
    availableMoves: Moves;
    position: string;
    positionValue: string;
    remoteness: number;
    mex: string;
};

export type Moves = Record<string, Move>;

export type MoveNames = Record<string, string>;

export type Move = {
    deltaRemoteness: number;
    move: string;
    moveName: string;
    moveValue: string;
    moveValueOpacity: number;
    position: string;
    positionValue: string;
    remoteness: number;
    mex: string;
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
    computerMoveDuration: number;
    showInstructions: boolean;
    showNextMoveDeltaRemotenesses: boolean;
    showNextMoveHints: boolean;
    showNextMoves: boolean;
    showOptions: boolean;
    showMenu: boolean;
    showVvhGuides: boolean;
    showVvhMeters: boolean;
};

export type Matches = Record<number, Match>;

export type Match = {
    id: number;
    gameType: string;
    gameId: string;
    gameTheme: string;
    variantId: string;
    startPosition: string;
    firstPlayer: Player;
    secondPlayer: Player;
    rounds: Rounds;
    moveHistory: string;
    round: Round;
    created: number;
    lastPlayed: number;
    ended: number;
    backgroundLoading: boolean;
};

export type Rounds = Record<number, Round>;

export type Round = {
    id: number;
    firstPlayerTurn: boolean;
    move: string;
    moveName: string;
    moveValue: string;
    position: Position;
};
