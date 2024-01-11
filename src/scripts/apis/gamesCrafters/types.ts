export type Status = {
    status: string;
    gui_status: string;
};

export type Error = Status & {
    error: string;
};

export type Instructions = {
    instructions: string;
}

export type Games = Array<{
    id: string;
    name: string;
    type: string;
    gui: string;
}>;

export type Game = {
    id: string;
    name: string;
    variants: Array<{
        id: string;
        name: string;
        gui: string;
    }>;
    allowCustomVariantCreation: boolean;
    supportsWinBy: boolean;
    instructions: string;
};

export type Variant = {
    id: string;
    name: string;
    startPosition: string;
    autoguiStartPosition: string;
    imageAutoGUIData: ImageAutoGUIData;
    gui: string;
};

export type ImageAutoGUIData = {
    defaultTheme: string;
    themes: Record<string, ImageAutoGUITheme>;
};

export type ImageAutoGUITheme = {
    space: Array<number>;
    centers: Array<Array<number>>;
    background: string;
    foreground: string;
    entities: Record<string, ImageAutoGUIEntity>;
    textEntityFontSize: number;
    circleButtonRadius: number;
    lineWidth: number;
    arrowWidth: number;
    textButtonFontSize: number;
    entitiesOverArrows: boolean;
    sounds: Record<string, string>;
    animationType: string;
    defaultAnimationWindow: Array<number>;
};

export type ImageAutoGUIEntity = {
    image: string;
    scale: number;
};

export type Move = {
    move: string;
    autoguiMove: string;
    position: string;
    autoguiPosition: string;
    deltaRemoteness: number;
    moveValue: string;
    positionValue: string;
    remoteness: number;
    winby: number;
    mex: string;
    drawLevel: number;
    drawRemoteness: number;
};

export type Position = {
    moves: Array<Move>;
    position: string;
    autoguiPosition: string;
    positionValue: string;
    remoteness: number;
    winby: number;
    mex: string;
    drawLevel: number;
    drawRemoteness: number;
};