function runMove1() {
  setMove1();
  runRound();
}

function setMove1() {
  roundData.move = roundData.nextMove[0]["move"];
  roundData.board = roundData.nextMove[0]["board"];
  roundData.value = roundData.nextMove[0]["value"];
  roundData.valueCode = valueCodes[roundData.value];
  roundData.remoteness = roundData.nextMove[0]["remoteness"];
  roundData.turn = (roundData.turn + 1) % 2;
  roundData.turnName = turnNames[roundData.turn];
  roundData.round += 1;
}

function runMove2() {
  setMove2();
  runRound();
}

function setMove2() {
  roundData.move = roundData.nextMove[1]["move"];
  roundData.board = roundData.nextMove[1]["board"];
  roundData.value = roundData.nextMove[1]["value"];
  roundData.valueCode = valueCodes[roundData.value];
  roundData.remoteness = roundData.nextMove[1]["remoteness"];
  roundData.turn = (roundData.turn + 1) % 2;
  roundData.turnName = turnNames[roundData.turn];
  roundData.round += 1;
}

$(function() {
  // On move 1...
  $("#nextMove1").click(function() {
    runMove1();
  });

  // On move 2...
  $("#nextMove2").click(function() {
    runMove2();
  });
});
