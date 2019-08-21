// GUI Template Sample (ftz)
// Functions to update #guiContainer each game round

// function updateGUI() {
//   updateRound();
//   updateTurn();
//   updateBoard();
//   updateValue();
//   updateRemoteness();
//   updateNextMoves();
//   updateHints();
//   updateMessage();
// }

// function updateRound() {
//   $("#round").text(roundData.round);
// }

// function updateTurn() {
//   $("#turn").text(roundData.turn + 1);
// }

// function updateBoard() {
//   $("#board").text(roundData.board);
// }

// function updateValue() {
//   $("#value").text(roundData.value);
// }

// function updateRemoteness() {
//   $("#remoteness").text(roundData.remoteness);
// }

// function updateNextMoves() {
//   if (roundData.round == 1) {
//     $("#nextMove1").prop("disabled", false);
//     $("#nextMove2").prop("disabled", false);
//   }
//   if (typeof roundData.nextMove1 == "undefined") {
//     $("#nextMove1").prop("disabled", true);
//   }
//   if (typeof roundData.nextMove2 == "undefined") {
//     $("#nextMove2").prop("disabled", true);
//   }
// }

// function updateHints() {
//   if (typeof roundData.nextMove1 == "undefined") {
//     $("#nextMove1").css("background-color", "brown");
//   } else if (roundData.nextMove1["value"] == "win") {
//     $("#nextMove1").css("background-color", "red");
//   } else if (roundData.nextMove1["value"] == "lose") {
//     $("#nextMove1").css("background-color", "green");
//   } else {
//     $("#nextMove1").css("background-color", "white");
//   }

//   if (typeof roundData.nextMove2 == "undefined") {
//     $("#nextMove2").css("background-color", "brown");
//   } else if (roundData.nextMove2["value"] == "win") {
//     $("#nextMove2").css("background-color", "red");
//   } else if (roundData.nextMove2["value"] == "lose") {
//     $("#nextMove2").css("background-color", "green");
//   } else {
//     $("#nextMove2").css("background-color", "white");
//   }
// }

// function updateMessage() {
//   if (roundData.remoteness == 0) {
//     $("#message").text(`${roundData.turnName} ${roundData.value}s the game!`);
//   }
// }
