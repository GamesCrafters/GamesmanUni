<template>
    <div id="app-tournament-header">
        <h1><b>{{gameName}}</b></h1>
        <br><br>
        <p>
            <b>Rules</b>: {{rulesStrings[whichTournamentGame]}}
        </p>
        <br>
        <p>
            <b>Scoring</b>: {{scoringStrings[whichTournamentGame]}}
        </p>
        <br><br><br><br><br>
        <div id="app-tournament-turn-indicator" v-if="!isEndOfMatch">
            <h1 v-if="whoseTurn == 1" style="color:blue;">{{leftName}} Turn</h1>
            <h1 v-else style="color:red;">{{rightName}} Turn</h1>
        </div>
        <div id="app-tournament-results" v-else>
            <h1 v-if="isEndOfMatch">
                {{resultsMessage}}
            </h1>
            <br>
            {{actualResult}} {{potentialStrings[whichTournamentGame]}}
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const gameId = computed(() => store.getters.currentGameId);
    const variantId = computed(() => store.getters.currentVariantId);
    const position = computed(() => store.getters.currentPosition);
    const gameType = computed(() => store.getters.currentGameType);
    const gameName = computed(() => {
        if (!store.getters.games(gameType.value)) return "";
        if (!store.getters.game(gameType.value, gameId.value)) return "";
        const candidate = store.getters.game(gameType.value, gameId.value).name;
        if (candidate === 'Tic-Tac-Toe') {
            return 'Misére Tic-Tac-Toe'
        } else if (candidate === 'Connect 4') {
            return '6x6 Connect 4'
        }
        return candidate
    });
    const currentLeftPlayer = computed(() => store.getters.currentLeftPlayer);
    const currentRightPlayer = computed(() => store.getters.currentRightPlayer);
    const currentPlayer = computed(() => store.getters.currentPlayer);
    const leftName = computed(() => currentLeftPlayer.value.isComputer ? "Computer's" : "Your");
    const leftIsComputer = computed(() => currentLeftPlayer.value.isComputer);
    const rightName = computed(() => currentLeftPlayer.value.isComputer ? "Your" : "Computer's");
    const whoseTurn = computed(() => (
            (
                currentPlayer.value.isComputer && leftIsComputer.value ||
                !currentPlayer.value.isComputer && !leftIsComputer.value
            )
        ) ? 1 : 2);
    const resultsMessage = computed(() => {
        if (currentPositionValue.value === 'win') {
            return (currentPlayer.value.isComputer) ? "You lost. 💀" : "You won! 😮";
        } else if (currentPositionValue.value === 'tie') {
            return "The game is a tie. 😐";
        } else if (currentPositionValue.value === 'lose') {
            return (!currentPlayer.value.isComputer) ? "You lost. 💀" : "You won! 😮";
        } else {
            return "";
        }
    })
    const isEndOfMatch = computed(() => store.getters.isEndOfMatch);    
    const tournamentGamesList = ["Misére Tic-Tac-Toe", "Snake", "Dragons & Swans", "6x6 Connect 4", "Sim"];
    const whichTournamentGame = computed(() => tournamentGamesList.indexOf(gameName.value));
    const currentPositionValue = computed(() => store.getters.currentPositionValue);
    const rulesStrings = [
        "A family classic, this game is played on a 3-by-3 grid. Players alternate placing X and O pieces until one player creates a three-in-a-row of their own pieces, either vertically, horizontally, or diagonally. However, we are playing the misére variant, so you LOSE if you create a 3-in-a-row.",
        "The first player controls the snake's head and the second player controls the snake's tail. Players alternate turns moving one space up, right or left into any adjacent open square. Once a player has moved to an open spot, the departure square becomes occupied and neither player is allowed to move into that space. The game ends when there is no more room for a player to move. The last person to make a legal move wins.",
        "One player controls three dragons. The other player places and moves around 12 swans. A dragon can move to an orthogonally adjacent empty space. A dragon can also eat a swan by jumping over it to an empty space. The dragons' goal is to eat all of the swans. The swans player starts by placing one swan per turn. After all 12 swans have been placed, the swans player during each turn moves one swan to an orthogonally adjacent empty space. The swans' goal is to trap the dragons.",
        "The game is played on a 6-by-6 grid with gravity. Pieces fall to the bottom in the column they are dropped into. The players alternate dropping blue and red pieces, aiming to create a run of four in a row. As in tic-tac-toe, runs can be vertical, horizontal, or diagonal.",
        "The game starts with a board with six vertices (dots) and edges (lines between dots) between every single pair of vertices. The players, blue and red, alternate picking and coloring an uncolored edge. You lose if you make a triangle of only your color. This triangle must have vertices as endpoints -- intersecting lines do not make a new vertex. You win if you force your opponent to make a closed triangle of their color."
    ];
    const scoringStrings = [
        "Your score will be the number of tie moves you make. Tie moves are moves that will bring you to a tie ending state assuming perfect play.",
        "Winning results in a higher score than losing. Winning in fewer moves results in a higher score than winning in more moves. Losing in more moves results in a higher score than losing in fewer moves.",
        "We have placed you in a losing position. Try to delay your loss as much as you can. Your score is the number of moves you make before the game ends.",
        "Winning results in a higher score than losing. Winning in fewer moves results in a higher score than winning in more moves. Losing in more moves results in a higher score than losing in fewer moves.",
        "Winning results in a higher score than losing. Winning in fewer moves results in a higher score than winning in more moves. Losing in more moves results in a higher score than losing in fewer moves."
    ];

    const potentialStrings = [
        "In perfect play, one would tie the game.",
        "In perfect play, one would make 6 moves to win the game.",
        "In perfect play, one would make as many as 25 moves before the game ends.",
        "In perfect play, one would make 18 moves to win the game.",
        "In perfect play, one would make 7 moves to win the game."
    ]

    const movesMade = computed(() => {
        if (gameId.value === "connect4c" || gameId.value === "sim") {
            return Math.floor((store.getters.currentRoundId - 1) / 2);
        } else {
            return Math.floor(store.getters.currentRoundId / 2);
        }
    });
    const resultsMessage2 = computed(() => {
        if (currentPositionValue.value === 'win') {
            return (currentPlayer.value.isComputer) ? "lose" : "win";
        } else if (currentPositionValue.value === 'tie') {
            return "tie";
        } else if (currentPositionValue.value === 'lose') {
            return (!currentPlayer.value.isComputer) ? "lose" : "win";
        } else {
            return "";
        }
    });
    const actualResult = computed(() => {
        if (gameId.value === "swans") {
            return "You made " + movesMade.value + " moves total."
        } else {
            return "You made " + movesMade.value + " moves to " + resultsMessage2.value + " the game.";
        }
    });
</script>

<style lang="scss" scoped>
    #app-tournament-header {
        width: 30%;
        border-radius: 1rem;
        margin: 1rem;

        p {
            font-size: 200%;
        }
        b {
            font-size: 100%;
            font-weight: bold;
        }
        h1 {
            font-size: 300%;
        }
    }

    #app-tournament-turn-indicator {
        text-align: center;
        border-radius: 0.1rem;
        font-size: 150%;
        margin: 0.1rem;
    }

    #app-tournament-results {
        text-align: center;
        border-radius: 0.1rem;
        font-size: 150%;
        margin: 0.1rem;
    }
</style>