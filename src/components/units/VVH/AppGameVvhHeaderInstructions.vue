<template>
    <div id="app-game-vvh-header-instructions">
        <button class="button" @click="store.commit(mutationTypes.showViewsInstructions, true)" title="View Instructions">𝓲</button>
        <UniPopupWindow v-if="options && options.showViewsInstructions" @close="store.commit(mutationTypes.showViewsInstructions, false)">
            <div id="views-instructions-wrapper">
                <h1>Views</h1>
                <p>The different views use the colors of a traffic light (red, yellow, green) to indicate the value of a visited position, unvisited position, or move.</p>
                <mark class="uni-win color">win</mark>
                <mark class="uni-draw color">draw</mark>
                <mark class="uni-tie color">tie</mark>
                <mark class="uni-lose color">lose</mark>
                <p></p>
                <p>Visited positions are denoted as a big nodes (circle), unvisited positions are shown as smaller nodes, and moves are represented as a link (line) connecting two nodes.</p>
                <img src="../../../models/images/views/position.png" alt="Winning position node circled in red." title="Winning position node boxed in red lines." width="300" style="padding-right: 2.5px; padding-left: 2.5px;"/>
                <img src="../../../models/images/views/unvisited-positions.png" alt="Three unvisited positions circled in red. 1 losing position, 2 winning positions." title="Three unvisited positions circled in red. 1 losing position, 2 winning positions." width="300"  style="padding-right: 2.5px; padding-left: 2.5px;"/>
                <img src="../../../models/images/views/moves.png" alt="Three move links circled in red. 1 winning move, 2 losing moves." title="Three move links circled in red. 1 winning move, 2 losing moves." width="300"  style="padding-right: 2.5px; padding-left: 2.5px;"/>
                <div id="remoteness-view-instructions">
                    <h2>Remoteness View</h2>
                    <p><strong>Remoteness:</strong> The "Remoteness" value of a game's position indicates, assuming perfect play, how many moves remain until the end of the game (i.e., a leaf node in the game tree).</p>
                    <hr/>
                    <p>The "Remoteness View" tracks the remoteness value throughout the game and can be metaphorically thought of as a tug-of-war, representing the shifting balance of the game between the two players. In the image below, the red node in the first row indicates that, assuming perfect play, player two will win in 11 turns. Any drawing positions will be placed below the <strong>'D'</strong> label.</p>
                    <img src="../../../models/images/views/remoteness.png" alt="The Remoteness View showing player 2 won after blundering initially." title="The Remoteness View showing player 2 won after blundering initially." width="600"/>
                    <hr/>
                </div>
                <div id="winby-view-instructions">
                    <h2>Win By View</h2>
                    <p><strong>Win By:</strong> The "Win By" value shows, assuming perfect play, the number of points or pieces by which the current player is expected to win over the opponent by the end of the game. Perfect play when prioritizing Win By is when both players are trying to maximize their final score; regardless of how long the game takes (remoteness does not matter).</p>
                    <p>The "Win By View" tracks the Win By value throughout the game. A vertical line of nodes in the Win By View indicates perfect play from both players prioritizing by win by.</p>
                    <img src="../../../models/images/views/winby.png" alt="Perfect play prioritizing win by over remoteness. Player 2 wins by 8." title="Perfect play prioritizing win by over remoteness. Player 2 wins by 8." width="600"/>
                    <hr/>
                </div>
                <div id="drawlevel-view-instructions">
                    <h2>Draw Level View</h2>
                    <p><strong>Pure Draw:</strong> A subset of draw positions are considered to be "Pure Draw" when a player can force the other player to a draw position that has losing moves or draw-losing moves.</p>
                    <p><strong>Non-Pure Draw:</strong>  A subset of draw positions are considered to be "Non-Pure Draw" when both players can force the other to a draw position that has losing moves.</p>
                    <img src="../../../models/images/views/game-space.png" alt="Game Space." title="Game Space" width="300"/>
                    <p><strong>Draw Level:</strong> The distance in pure draw subsets (not positions) from a pure draw subset to the primitive subset. </p>
                    <p><strong>Draw Level Fringe:</strong> The subset of draw positions in the pure draw subset which have losing moves (if draw level = 0) or draw-losing moves (if draw level > 0).</p>
                    <img src="../../../models/images/views/drawlevel-fringes.png" alt="Draw Level fringes circled in red." title="Draw Level fringes circled in red." width="300"/>
                    <p><strong>Draw Remoteness:</strong> The "Draw Remoteness" value of a game's pure draw position indicates, assuming perfect play, how many moves until the draw fringe.</p>
                    <p>The "Draw Level View" keeps track of the "Draw Level" and the "Draw Remoteness" of Pure Draw Positions. Any Non-Draw (ND) positions or Non-Pure Draw (NPD) positions will be placed below the <strong>'ND/NPD*'</strong> label.</p>
                    <img src="../../../models/images/views/drawlevel.png" alt="Draw Level View." title="Draw Level View."  width="600"/>
                    <p>For more information on draw analysis, see Dr. Garcia's <a href="https://people.eecs.berkeley.edu/~ddgarcia/papers/OpenPositionsWLD.html" target="_blank" title="Draw Positions Are Not All Equal">"Draw Positions Are Not All Equal"</a>.</p>
                    <hr/>
                </div>
                <div id="column-view-instructions">
                    <h2>Column View</h2>
                    <p>The "Column View" displays all possible moves along with their value ('win', 'lose', 'tie', 'draw', 'unsolved'), remoteness, win by (if available), draw level (if available), and draw remoteness (if available) from the current game position in a vertical list.</p>
                    <img src="../../../models/images/views/column.png" alt="Column View." title="Column View."  width="600"/>
                    <hr/>
                </div>
                <div id="gamescrafters">
                    <h2>GamesCrafters</h2>
                    <ul>
                        <li>Alvaro Estrella (Views, Views Instructions)</li>
                        <li>Cameron Cheung (Remoteness View)</li>
                        <li>Rodrigo Ortiz (Draw Level View)</li>
                    </ul>
                </div>
            </div>
            If you worked on this project and were not properly credited, please email <a href="mailto: ddgarcia@cs.berkeley.edu">ddgarcia@cs.berkeley.edu</a> to request a correction.
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import UniPopupWindow from "../../templates/UniPopupWindow.vue";

    const store = useStore();
    const options = computed(() => store.getters.options);
</script>

<style lang="scss" scoped>
    #app-game-vvh-header-instructions {
        > .button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            margin: 0.5rem 0;
            width: max(2.5rem, min(5vh, 5vw));
        }
    }

    h1 {
        text-align: center;
        font-size: 4em;
        padding-bottom: 1em;
        font-weight: 900;
        color: var(--secondaryColor);
    }

    h2 {
        text-align: left;
        font-weight: 600;
        font-size: 2em;
        margin: 1rem 0;
        color: var(--secondaryColor);
        padding-bottom: 0.3em;
        border-bottom: 0.1em solid var(--neutralColor);
    }

    p {
        font-size: 1.6em;
        padding-bottom: 1.6em;
    }

    strong {
        font-size: 1em;
        font-weight: 800;
    }

    a {
        font-size: 1em;
    }

    a:link {
        font-size: 1em;
        font-weight: 400;
    }

    mark {
    border-radius: 1rem;
    margin: 1rem;
    padding: .25rem .5rem;
    }

    ul {
        padding-bottom: 1.6em;
        padding-left: 1.6em;
        list-style: square;

        > li {
            text-align: justify;
            list-style-position: outside;
            font-size: 1.6em;
            padding-bottom: .8em;
        }
    }
    
</style>
