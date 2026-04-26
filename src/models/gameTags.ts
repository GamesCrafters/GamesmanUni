/**
 * gameTags.ts
 *
 * Enrichment data for game/puzzle cards in the Games browser.
 * Keys are game IDs as used by the store (matching thumbnail filenames).
 *
 * style    — from the sidebar's GAME STYLE chips
 *            valid values: "Blocking" | "Rearranger" | "Dartboard" | "Chasing"
 *                          | "Impartial" | "Partisan" | "Connection" | "Majority Control"
 * solveType — from the sidebar's SOLVE TYPE chips
 *            valid values: "Remoteness" | "Win By" | "Mex" | "Draw Analysis" | "Unsolved"
 * misc     — from the sidebar's MISC chips
 *            valid values: "Educational"
 *
 * Source: ui_reference/gamesmanuni_base.html GAMES array (authoritative for listed games).
 * Remaining games assigned from game-theory knowledge; mark // TODO: tag if uncertain.
 */
export const gameTags: Record<string, { style: string[]; solveType: string[]; misc: string[] }> = {

    // ── From reference HTML (authoritative) ────────────────────────────────

    "connect4":       { style: ["Connection", "Partisan"],             solveType: ["Remoteness"],              misc: [] },
    "othello":        { style: ["Majority Control", "Partisan"],        solveType: ["Win By"],                  misc: [] },
    "kayles":         { style: ["Impartial"],                           solveType: ["Mex"],                     misc: ["Educational"] },
    "tictactoe":      { style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: ["Educational"] },
    "dao":            { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "hareandhounds":  { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "hobaggonu":      { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "tootandotto":    { style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: [] },
    "chinesechess":   { style: ["Chasing", "Partisan"],                 solveType: ["Unsolved"],                misc: [] },
    "chomp":          { style: ["Impartial"],                           solveType: ["Mex"],                     misc: ["Educational"] },
    "clobber":        { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "graphgame":      { style: ["Impartial"],                           solveType: ["Mex"],                     misc: ["Educational"] },

    // Puzzles from reference HTML
    "bishoppuzzle":   { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "towersofhanoi":  { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "lightsout":      { style: [],                                       solveType: [],                          misc: ["Educational"] },
    "rushhour":       { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "npuzzle":        { style: [],                                       solveType: [],                          misc: [] },
    "pancakes":       { style: [],                                       solveType: ["Remoteness"],              misc: [] },

    // ── Two-player games ───────────────────────────────────────────────────

    "0to10by1or2":    { style: ["Impartial"],                           solveType: ["Mex"],                     misc: ["Educational"] },
    "1dchess":        { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "3spot":          { style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "4squaretictactoe": { style: ["Dartboard", "Partisan"],             solveType: ["Remoteness"],              misc: [] },
    "abrobad":        { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "achi":           { style: ["Dartboard", "Rearranger", "Partisan"], solveType: ["Remoteness"],              misc: [] },
    "adugo":          { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "allqueenschess": { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "baghchal":       { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "beeline":        { style: ["Connection", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "change":         { style: ["Partisan"],                            solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "chess":          { style: ["Chasing", "Partisan"],                 solveType: ["Unsolved"],                misc: [] },
    "chinesecheckers":{ style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "chopsticks":     { style: ["Partisan"],                            solveType: ["Remoteness"],              misc: ["Educational"] },
    "chungtoi":       { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "connect4twist":  { style: ["Connection", "Dartboard", "Partisan"], solveType: ["Remoteness"],              misc: [] },
    "dawsonschess":   { style: ["Impartial"],                           solveType: ["Mex"],                     misc: [] },
    "dinododgem":     { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "dodgem":         { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "domineering":    { style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: ["Educational"] },
    "dragonsandswans":{ style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "dshogi":         { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "eightball":      { style: ["Majority Control", "Partisan"],        solveType: ["Remoteness"],              misc: [] },
    "euclidsgame":    { style: ["Impartial"],                           solveType: ["Mex"],                     misc: ["Educational"] },
    "expantix":       { style: ["Connection", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "fivefieldkono":  { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "forestfox":      { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "fourfieldkono":  { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "foxandhounds":   { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "ghost":          { style: ["Partisan"],                            solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "gobbletgobblers":{ style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: [] },
    "hexapawn":       { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: ["Educational"] },
    "horses":         { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "jan":            { style: ["Partisan"],                            solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "jenga":          { style: ["Impartial"],                           solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "joust":          { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "kaooa":          { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "konane":         { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "legrec":         { style: ["Partisan"],                            solveType: ["Remoteness"],              misc: [] }, // TODO: tag
    "lewthwaitesgame":{ style: ["Blocking", "Rearranger", "Partisan"],  solveType: ["Remoteness"],              misc: [] },
    "lgame":          { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "lite3":          { style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: [] },
    "mancala":        { style: ["Majority Control", "Partisan"],        solveType: ["Win By"],                  misc: [] },
    "mutorere":       { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "neutron":        { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "nim":            { style: ["Impartial"],                           solveType: ["Mex"],                     misc: ["Educational"] },
    "ninemensmorris": { style: ["Blocking", "Dartboard", "Rearranger", "Partisan"], solveType: ["Remoteness"], misc: [] },
    "notakto":        { style: ["Dartboard", "Impartial"],              solveType: ["Remoteness"],              misc: ["Educational"] },
    "nutictactoe":    { style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: [] },
    "oddoreven":      { style: ["Impartial"],                           solveType: ["Mex"],                     misc: ["Educational"] },
    "orbito":         { style: ["Majority Control", "Partisan"],        solveType: ["Remoteness"],              misc: [] },
    "ponghauki":      { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "quarto":         { style: ["Dartboard", "Partisan"],               solveType: ["Remoteness"],              misc: [] },
    "quickchess":     { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "quickcross":     { style: ["Connection", "Dartboard", "Partisan"], solveType: ["Remoteness"],              misc: [] },
    "quixo":          { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "sevenpennies":   { style: ["Impartial"],                           solveType: ["Mex"],                     misc: [] },
    "shifttactoe":    { style: ["Dartboard", "Rearranger", "Partisan"], solveType: ["Remoteness"],              misc: [] },
    "sim":            { style: ["Connection", "Impartial"],             solveType: ["Remoteness"],              misc: ["Educational"] },
    "slide5":         { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "snake":          { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "squaredance":    { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "squirrels":      { style: ["Chasing", "Partisan"],                 solveType: ["Remoteness"],              misc: [] },
    "tactix":         { style: ["Impartial"],                           solveType: ["Mex"],                     misc: [] },
    "tantfant":       { style: ["Blocking", "Partisan"],                solveType: ["Remoteness"],              misc: [] },
    "tantrix":        { style: ["Connection", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "teeko":          { style: ["Dartboard", "Rearranger", "Partisan"], solveType: ["Remoteness"],              misc: [] },
    "tictactwo":      { style: ["Dartboard", "Rearranger", "Partisan"], solveType: ["Remoteness"],              misc: [] },
    "tiltago":        { style: ["Rearranger", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "topitop":        { style: ["Majority Control", "Partisan"],        solveType: ["Remoteness"],              misc: [] },
    "tsoroyematatu":  { style: ["Dartboard", "Impartial"],              solveType: ["Remoteness"],              misc: [] },
    "winkers":        { style: ["Majority Control", "Partisan"],        solveType: ["Remoteness"],              misc: [] },
    "y":              { style: ["Connection", "Partisan"],              solveType: ["Remoteness"],              misc: [] },
    "yote":           { style: ["Blocking", "Chasing", "Partisan"],     solveType: ["Remoteness"],              misc: [] },
    "chipschallenge": { style: [],                                       solveType: ["Remoteness"],              misc: [] }, // puzzle-like

    // ── Puzzles (onePlayer) ────────────────────────────────────────────────

    "clocksolitaire": { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "nqueens":        { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "pegsolitaire":   { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "rubikscube":     { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "rubiksmagic":    { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "solitairechess": { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "spinout":        { style: [],                                       solveType: ["Remoteness"],              misc: [] },
    "toadsandfrogspuzzle": { style: [],                                  solveType: ["Remoteness"],              misc: ["Educational"] },
    "topspin":        { style: [],                                       solveType: ["Remoteness"],              misc: [] },
};
