export type AppExternalDataSourcesData = {
    gamesmanUniGitHubRepositoryDataSource: string;
    onePlayerGamesDataSource: string;
    twoPlayersGamesDataSource: string;
};

export type AppGameOptionsData = {
    showDateTime: boolean;
    showInstruction: boolean;
    showNextMoves: boolean;
    showNextMoveDeltaRemotenesses: boolean;
    showNextMoveHints: boolean;
    showOptions: boolean;
    showStopWatch: boolean;
    showVisualValueHistory: boolean;
};

export type AppGameRoundData = {
    id: number;
    move: string;
    moveValue: string;
    position: string;
    positionValue: string;
    remoteness: number;
};

export type AppGameVariantData = {
    description: string;
    id: string;
    status: string;
    startPosition: string;
};

export type AppGameVariantsData = Array<AppGameVariantData>;

export type AppGameData = {
    author: string;
    description: string;
    id: string;
    name: string;
    options: AppGameOptionsData;
    status: string;
    type: string;
    variant: AppGameVariantData;
    variants: AppGameVariantsData;
};

export type AppGamesData = Array<AppGameData>;

export type AppCommitData = {
    authorAvatarUrl: string;
    authorName: string;
    authorUrl: string;
    authorUsername: string;
    date: string;
    message: string;
    sha: string;
    url: string;
};

export type AppLatestCommitHistoryData = Array<AppCommitData>;

export type AppPreferencesData = {
    fallbackLocale: string;
    locale: string;
    theme: string;
};

export type AppData = {
    externalDataSources: AppExternalDataSourcesData;
    game: AppGameData;
    games: AppGamesData;
    latestCommitHistory: AppLatestCommitHistoryData;
    preferences: AppPreferencesData;
    version: string;
};
