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
        supportsWinBy: 0;
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
            imageAutoGUIData: ImageAutoGUIData;
        }>;
        custom: string;
        
    };
};

export type TwoPlayerGames = Status & {
    response: Array<Status & {
        gameId: string;
        name: string;
        supportsWinBy: number;
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
            imageAutoGUIData: ImageAutoGUIData;
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
            imageAutoGUIData: ImageAutoGUIData;
        }>;
    };
};

export type ImageAutoGUIData = {
    defaultTheme: string;
    themes: Record<string, ImageAutoGUITheme>;
};

export type ImageAutoGUITheme = {
    space: ImageAutoGUICoordinate;
    centers: Array<ImageAutoGUICoordinate>;
    background: string;
    foreground: string;
    entities: Record<string, ImageAutoGUIEntity>;
    circleButtonRadius: number;
    lineWidth: number;
    arrowWidth: number;
    entitiesOverArrows: boolean;
    sounds: Record<string, string>;
    animationType: string;
    defaultAnimationWindow: Array<number>;
};

export type ImageAutoGUICoordinate =
    [x: number, y: number];

export type ImageAutoGUIEntity = {
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
