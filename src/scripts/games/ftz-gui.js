function updateGUI() {
  updateRound();
  updateTurn();
  updateBoard();
  updateValue();
  updateRemoteness();
  updateNextMoves();
  updateHints();
  updateMessage();
}

function updateRound() {
  $("#round").text(roundData.round);
}

function updateTurn() {
  $("#turn").text(roundData.turn + 1);
}

function updateBoard() {
  $("#board").text(roundData.board);
}

function updateValue() {
  $("#value").text(roundData.value);
}

function updateRemoteness() {
  $("#remoteness").text(roundData.remoteness);
}

function updateNextMoves() {
  if (roundData.round == 1) {
    $("#nextMove1").prop("disabled", false);
    $("#nextMove2").prop("disabled", false);
  }
  if (roundData.nextMove.length == 0) {
    $("#nextMove1").prop("disabled", true);
    $("#nextMove2").prop("disabled", true);
  } else if (roundData.nextMove.length == 1) {
    if (roundData.nextMove[0].move == 1) {
      $("#nextMove2").prop("disabled", true);
    } else {
      $("#nextMove1").prop("disabled", true);
    }
  }
}

function updateHints() {
  if (typeof roundData.nextMove[0] == "undefined") {
    $("#nextMove1").css("background-color", "brown");
  } else if (roundData.nextMove[0]["value"] == "win") {
    $("#nextMove1").css("background-color", "red");
  } else if (roundData.nextMove[0]["value"] == "lose") {
    $("#nextMove1").css("background-color", "green");
  } else {
    $("#nextMove1").css("background-color", "white");
  }

  if (typeof roundData.nextMove[1] == "undefined") {
    $("#nextMove2").css("background-color", "brown");
  } else if (roundData.nextMove[1]["value"] == "win") {
    $("#nextMove2").css("background-color", "red");
  } else if (roundData.nextMove[1]["value"] == "lose") {
    $("#nextMove2").css("background-color", "green");
  } else {
    $("#nextMove2").css("background-color", "white");
  }
}

function updateMessage() {
  if (roundData.remoteness == 0) {
    $("#message").text(`${roundData.turnName} ${roundData.value}s the game!`);
  }
}
