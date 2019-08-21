var gameCode;
const games = {
  ftz: "Four to Zero",
  ttt: "Tic Tac Toe"
};
var gameTitle;

$(function() {
  $(".game").click(function(click) {
    gameCode = $(click.target).text();
    $("#gamesContainer").hide();
    $("#gameContainer").show();
    gameTitle = games[gameCode];
    runNewGame();
  });
});
