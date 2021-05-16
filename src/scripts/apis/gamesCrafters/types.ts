export type Status = {
    status: string;
};

export type Error = Status & {
    error: string;
};

export type OnePlayerGames = Status & {
    response: Array<
        Status & {
            gameId: string;
            name: string;
        }
    >;
};

export type OnePlayerGameVariants = Status & {
    response: {
        author: string;
        dateCreated: string;
        description: string;
        gameId: string;
        instructions: string;
        name: string;
        variants: Array<
            Status & {
                description: string;
                startPosition: string;
                variantId: string;
            }
        >;
    };
};

export type TwoPlayerGames = Status & {
    response: Array<
        Status & {
            gameId: string;
            name: string;
        }
    >;
};

export type TwoPlayerGameVariants = Status & {
    response: {
        gameId: string;
        instructions: string;
        name: string;
        variants: Array<
            Status & {
                description: string;
                startPosition: string;
                variantId: string;
            }
        >;
    };
};

export type Position = Status & {
    response: {
        moves: Array<{
            deltaRemoteness: number;
            move: string;
            moveValue: string;
            position: string;
            positionValue: string;
            remoteness: number;
        }>;
        position: string;
        positionValue: string;
        remoteness: number;
    };
};
