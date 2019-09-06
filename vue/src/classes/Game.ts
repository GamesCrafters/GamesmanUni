import { IGame } from "@/interfaces/IGame";
import { GameData } from "@/classes/GameData";
import { Round } from "@/classes/Round";
import { History } from "@/classes/History";

export class Game implements IGame {
  statuses: { [status: number]: string };
  status: number;
  id: string;
  name: string;
  dataBaseUrl: string;
  starterTurn: number;
  maximumRemoteness: number;
  round: Round;
  history: History;

  constructor(gameData?: GameData) {
    this.statuses = { 0: "loading", 1: "ready" };
    this.status = 0;
    this.id = (gameData && gameData.id) || "xxx";
    this.name = (gameData && gameData.name) || "XXX";
    this.dataBaseUrl = (gameData && gameData.dataBaseUrl) || ".";
    this.starterTurn = 0;
    this.maximumRemoteness = 0;
    this.round = new Round();
    this.history = new History();
  }

  setStatus(status: number) {
    this.status = status;
  }

  setStarterTurn(turn: number) {
    this.starterTurn = turn;
  }

  getStarterTurn(): number {
    return this.starterTurn;
  }

  getRound(): Round {
    return this.round;
  }

  setMaximumRemoteness(maximumRemoteness: number) {
    this.maximumRemoteness = maximumRemoteness;
  }

  // initiate game...
  // initGame() {
  //   // disable user interaction while loading data...
  //   this.$store.dispatch("setStatus", 0);
  //   // initiate current game...
  //   this.currentGame = new Game(this.$store.getters.gameData(
  //     this.$route.params.gameId
  //   ) as GameData);
  //   // set round 0 turn...
  //   this.currentGame.round.setTurn((this.currentGame.getStarterTurn() + 1) % 2);

  //   // get start from server...
  //   this.$http
  //     .get(`${this.currentGame.dataBaseUrl}/getStart`)
  //     .then((response: AxiosResponse) => {
  //       let startData: StartData = new StartData(response.data);
  //       // set round 0 board...
  //       this.currentGame.round.setBoard(startData.getBoard());

  //       // get start move value from server...
  //       this.$http
  //         .get(
  //           `${
  //             this.currentGame.dataBaseUrl
  //           }/getMoveValue?board=${this.currentGame.round.getBoard()}`
  //         )
  //         .then((response: AxiosResponse) => {
  //           let startMoveValueData: StartMoveValueData = new StartMoveValueData(
  //             response.data
  //           );
  //           // set round 0 remoteness...
  //           this.currentGame.round.setRemoteness(
  //             startMoveValueData.getRemoteness()
  //           );
  //           // set game maximum remoteness...
  //           this.currentGame.setMaximumRemoteness(
  //             startMoveValueData.getRemoteness()
  //           );
  //           // save round 0...
  //           this.currentGame.history.push(this.currentGame.getRound());
  //           // load round 1...
  //           this.currentGame.round.setValue(startMoveValueData.getValue());
  //           this.currentGame.round.setTurn();
  //           this.currentGame.round.setRoundNumber();
  //           // save round 1...
  //           this.currentGame.history.push(this.currentGame.round);
  //           // save currentGame to store...
  //           this.$store.dispatch("saveCurrentGame", this.currentGame);
  //           // reenable user interaction...
  //           this.$store.dispatch("setStatus", 1);
  //         });
  //     });
  // }

  // run round...
  // runRound() {
  //   // disable user interaction while loading data...
  //   this.$store.dispatch("setStatus", 0);
  //   // load current game from store...
  //   this.currentGame = this.$store.getters.currentGame;
  //   // set move in last round...
  //   this.currentGame.round.setMove(this.$store.getters.currentMove);
  //   // update last round in history...
  //   this.currentGame.history.updateLastRound(
  //     this.currentGame.round.move,
  //     this.currentGame.round.moveValue
  //   );
  //   // load new round based on last move...
  //   this.currentGame.round = new Round(
  //     this.currentGame.round.nextMoveValuesData.getNextMoveValueData(
  //       this.currentGame.round.getMove()
  //     ),
  //     this.currentGame.round
  //   );
  //   // load new round nextMoveValues from server...
  //   this.$http
  //     .get(
  //       `${
  //         this.currentGame.dataBaseUrl
  //       }/getNextMoveValues?board=${this.currentGame.round.getBoard()}`
  //     )
  //     .then((response: AxiosResponse) => {
  //       let nextMoveValuesData: NextMoveValuesData = new NextMoveValuesData(
  //         response.data
  //       );
  //       // set new round nextMoveValues...
  //       this.currentGame.round.setNextMoveValuesData(nextMoveValuesData);
  //       // save new round...
  //       this.currentGame.history.push(this.currentGame.round);
  //       // save currentGame to store...
  //       this.$store.dispatch("saveCurrentGame", this.currentGame);
  //       // reenable user interaction...
  //       this.$store.dispatch("setStatus", 1);
  //     });
  // }
}
