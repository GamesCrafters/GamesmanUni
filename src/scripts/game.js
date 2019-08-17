const dataBaseUrl =
  "https://nyc.cs.berkeley.edu/classic/service/gamesman/puzzles/4to0/";
const valueCodes = { win: 1, tie: 2, lose: 3 };
const turnNames = { 0: "Player 1", 1: "Player 2" };
var maxRemoteness;
var roundData = {
  move: null,
  board: null,
  value: null,
  valueCode: null,
  remoteness: null,
  turn: null,
  turnName: null,
  round: null,
  nextMove: []
};
var roundHistory = {
  moves: [],
  boards: [],
  values: [],
  valueCodes: [],
  remotenesses: [],
  turns: [],
  turnNames: [],
  rounds: []
};

function runNewGame() {
  console.log(`Starting a new game of ${gameTitle}...`);
  setGameScripts();
  setGameTitle();
  resetData();
  getNewBoard(runRound);
}

function setGameScripts() {
  $("#gameGuiScript").attr("src", `./scripts/games/${gameCode}-gui.js`);
  $("#gameScript").attr("src", `./scripts/games/${gameCode}.js`);
}

function setGameTitle() {
  $("#gameTitle").text(gameTitle);
}

function resetData() {
  roundData = {
    move: null,
    board: null,
    value: null,
    valueCode: null,
    remoteness: null,
    turn: null,
    turnName: null,
    round: null,
    nextMove: []
  };
  roundHistory = {
    moves: [],
    boards: [],
    values: [],
    valueCodes: [],
    remotenesses: [],
    turns: [],
    turnNames: [],
    rounds: []
  };
}

function getNewBoard(runRound) {
  $.getJSON(`${dataBaseUrl}getStart`, function(data) {
    roundData.board = data["response"];
    $.getJSON(`${dataBaseUrl}getMoveValue?board=${roundData.board}`, function(
      data
    ) {
      roundData.move = data["response"]["move"];
      roundData.value = data["response"]["value"];
      roundData.valueCode = valueCodes[roundData.value];
      roundData.remoteness = data["response"]["remoteness"];
      roundData.turn = 0;
      roundData.turnName = turnNames[roundData.turn];
      roundData.round = 1;
      setMaxRemoteness();
      runRound();
    });
  });
}

function setMaxRemoteness() {
  maxRemoteness = roundData.remoteness;
}

function runRound() {
  console.log(`Round ${roundData.round}:`, roundData);
  setRoundHistory();
  getNextMoves(updateGUI, updateHistory);
}

function setRoundHistory() {
  roundHistory.moves.push(roundData.move);
  roundHistory.boards.push(roundData.board);
  roundHistory.values.push(roundData.value);
  roundHistory.valueCodes.push(roundData.valueCode);
  roundHistory.remotenesses.push(roundData.remoteness);
  roundHistory.turns.push(roundData.turn);
  roundHistory.turnNames.push(roundData.turnName);
  roundHistory.rounds.push(roundData.round);
}

function getNextMoves(updateGUI, updateHistory) {
  roundData.nextMove = [];
  $.getJSON(
    `${dataBaseUrl}getNextMoveValues?board=${roundData.board}`,
    function(data) {
      data["response"].forEach(function(nextMove) {
        roundData.nextMove.push(nextMove);
      });
      updateGUI();
      updateHistory();
    }
  );
}

function updateHistory() {
  drawHistory(style, roundHistory);
  $("#historyContainer").scrollTop(100000);
}

$(function() {
  // On restart...
  $("#restart").click(runNewGame);

  // On resize...
  $("#historyContainer").resize(updateHistory);
});
