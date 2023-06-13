export type Status = {
    status: string;
    gui_status: string;
};

export type Error = Status & {
    error: string;
};

export type OnePlayerGames = Status & {
    response: Array<Status & {
        gameId: string;
        name: string;
    }>;
};

export type OnePlayerGameVariants = Status & {
    response: {
        author: string;
        dateCreated: string;
        description: string;
        gameId: string;
        instructions: string;
        name: string;
        variants: Array<Status & {
            description: string;
            startPosition: string;
            variantId: string;
            autogui_v2_data: AutoGUIv2Data;
        }>;
        custom: string;
    };
};

export type TwoPlayerGames = Status & {
    response: Array<Status & {
            gameId: string;
        name: string;
    }>;
};

export type TwoPlayerGameVariants = Status & {
    response: {
        gameId: string;
        instructions: string;
        name: string;
        variants: Array<Status & {
            description: string;
            startPosition: string;
            variantId: string;
            autogui_v2_data: AutoGUIv2Data;
        }>;
        custom: string;
    };
};

export type GameVariant = Status & {
    response: {
        variant: Array<{
            description: string;
            startPosition: string;
            variantId: string;
            autogui_v2_data: AutoGUIv2Data;
        }>;
    };
};

export type AutoGUIv2Data = {
    defaultTheme: string;
    themes: Record<string, AutoGUIv2Theme>;
};

export type AutoGUIv2Theme = {
    backgroundGeometry: AutoGUIv2Coordinate;
    backgroundImage: string;
    foregroundImage: string;
    piecesOverArrows: boolean;
    arrowWidth: number;
    lineWidth: number;
    defaultMoveTokenRadius: number;
    centers: Array<AutoGUIv2Coordinate>;
    piecesToBeIntroduced: string;
    animationType: string;
    pieces: Record<string, AutoGUIv2Token>;
};

export type AutoGUIv2Coordinate =
    [x: number, y: number];

export type AutoGUIv2Token = {
    image: string;
    scale: number;
};

export type Position = Status & {
    response: {
        moves: Array<{
            deltaRemoteness: number;
            move: string;
            moveName: string;
            moveValue: string;
            position: string;
            positionValue: string;
            remoteness: number;
            mex: string;
            animationPhases: Array<Array<string>>;
        }>;
        position: string;
        positionValue: string;
        remoteness: number;
        mex: string;
    };
};

export type RandomPosition = Status & {
    response: {
        position: string;
    }
};
