export interface TRawGameData {
  status: "ok";
  response: {
    gameId: string;
    instructions: string;
    name: string;
    variants: Array<{
      variantId: string;
      description: string;
      status: string;
      startPosition: string;
    }>;
  };
}
