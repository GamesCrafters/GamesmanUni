<template>
    <div id="app-game-vvh-body-treeview">
        <div ref="treeContainer" id="tree-wrapper"></div>
        <div id="meters" v-if="toggleOptions">
            <div class="meter">
                <p class="label">Chart Height</p>
                <VueSlider v-model="chartHeight" :min="200" :max="500" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Node Radius</p>
                <VueSlider v-model="nodeRadius" :min="20" :max="100" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Node Stroke Width</p>
                <VueSlider v-model="nodeStrokeWidth" :min="1" :max="10" :tooltip="'active'" />
            </div>
            <div class="meter">
                <p class="label">Link Stroke Width</p>
                <VueSlider v-model="linkStrokeWidth" :min="1" :max="10" :tooltip="'active'" />
            </div>
            <div class="view-option">
                <input class="uni-toggle-button"
                                    aria-label="toggle"
                                    type="checkbox"
                                    v-model="showCurrentMovesOnly"/>
                <label for="checkbox">Show Current Round Moves Only</label>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
    import { computed, ref, onMounted, watch, reactive } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import * as d3 from "d3";
    import VueSlider from "vue-slider-component";
    import "vue-slider-component/theme/default.css";

    const store = useStore();
    const currentPosition = computed(() => store.getters.currentPosition);
    const currentRoundId = computed(() => store.getters.currentRoundId);
    const currentValuedRounds = computed(() => store.getters.currentValuedRounds);

    const chartHeight = ref(200);
    const nodeRadius = ref(20);
    const nodeStrokeWidth = ref(2);
    const linkStrokeWidth = ref(2);
    const showCurrentMovesOnly = ref(false);

    defineProps({
        toggleOptions: Boolean,
        toggleScrolling: Boolean,
        toggleGuides: Boolean,
    });

    interface TreeNode {
        parentNode?: TreeNode;
        position: string;
        positionValue: string;
        moveValue?: string;
        remoteness: number;
        winby?: number;
        drawLevel?: number;
        drawRemoteness?: number;
        isUnexplored: boolean;
        children: TreeNode[];
    }
    const computeInitialTreeData = (): TreeNode => {
        if (!currentValuedRounds.value || currentValuedRounds.value.length <= 1) {
            return {
                position: "",
                positionValue: "",
                remoteness: 0,
                isUnexplored: true,
                children: []
            };
        }

        // For some reason currentValuedRounds is 1-indexed;
        const initialPosition = currentValuedRounds.value[1].position;
        if (!initialPosition || !initialPosition.availableMoves) {
            return {
                position: "",
                positionValue: "",
                remoteness: 0,
                isUnexplored: true,
                children: []
            };
        }

        const children = Object.entries(initialPosition.availableMoves).map(([moveName, move]) => {
            const treeNode: TreeNode = {
                position: move.position,
                positionValue: move.positionValue,
                moveValue: move.moveValue,
                remoteness: move.remoteness,
                winby: move.winby,
                drawLevel: move.drawLevel,
                drawRemoteness: move.drawRemoteness,
                isUnexplored: true,
                children: []
            };

            return treeNode;
        });
        
        const root: TreeNode = {
            position: initialPosition.position,
            positionValue: initialPosition.positionValue,
            remoteness: initialPosition.remoteness,
            winby: initialPosition.winby,
            drawLevel: initialPosition.drawLevel,
            drawRemoteness: initialPosition.drawRemoteness,
            isUnexplored: false,
            children: children
        };

        children.forEach((child) => {
            child.parentNode = root;
        });

        return root;
    };

    const treeData = ref<TreeNode | null>(null);
    
    const currentNode = ref<TreeNode | null>(null);

    const treeContainer = ref<HTMLDivElement | null>(null);
  
    const drawTree = (data: TreeNode, container: HTMLDivElement) => {
        const width = container.offsetWidth;
        const height = chartHeight.value;
        
        d3.select(container).select("svg").remove();

        const svg = d3
        .select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", height);
  
        const g = svg.append("g")
            .attr("transform", "translate(50, 50)");

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        const root = d3.hierarchy(data);
        
        const maxDepth = d3.max(root.descendants(), (d) => d.depth);
        const treeLayout = d3.tree<TreeNode>().size([width - 100, maxDepth ? ((nodeRadius.value * 2) + 20) * maxDepth : height - 100]);
        treeLayout.separation((a, b) => {
        const factor = (a.parent === b.parent ? 1 : 2);
            return factor * 20;
        });
        
        treeLayout(root);

        g.selectAll("line")
            .data(root.links())
            .join("line")
            .attr("x1", (d) => d.source.x!)
            .attr("y1", (d) => d.source.y!)
            .attr("x2", (d) => d.target.x!)
            .attr("y2", (d) => d.target.y!)
            .attr("stroke", (d) => {
                const move = d.source.data.children?.find(child => child.position === d.target.data.position);
                if (move) {
                    return `var(--${move.moveValue}Color)`;
                }
                return "black";
            })
            .attr("stroke-width", linkStrokeWidth.value);

        const nodes = g
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  
        nodes
            .append("circle")
            .attr("r", nodeRadius.value)
            .attr("stroke-width", nodeStrokeWidth.value)
            .attr("stroke", "black")
            .attr("style", (d) => {
                const color = `var(--${d.data.positionValue}Color)`;
                const opacity = !showCurrentMovesOnly.value ? (d.data.isUnexplored ? "0.5" : "1") : (d.data.isUnexplored ? (d.data.isUnexplored && d.data.parentNode?.position == currentNode.value?.position ? "0.5" : "0") : "1");
                return `fill: ${color}; opacity: ${opacity};`;
            })
            .attr("cursor", (d) => (d.data.isUnexplored ? "pointer" : "default"))
            .on("click", (event, d) => {
                if (d.data.isUnexplored) {
                    alert(`Move node clicked:\nPosition: ${d.data.position}\nValue: ${d.data.positionValue}`);
                }
            });

        nodes
            .append("text")
            .attr("dy", 0)
            .attr("text-anchor", "middle")
            .text((d) => d.data.position);

        nodes
            .append("text")
            .attr("dy", 10)
            .attr("text-anchor", "middle")
            .text((d) => d.data.remoteness);
    };
  
    onMounted(async () => {
        await waitForCurrentValuedRounds();

        treeData.value = computeInitialTreeData();
        if (treeContainer.value) {
            currentNode.value = treeData.value;
            drawTree(treeData.value, treeContainer.value);
        }
    });

    const waitForCurrentValuedRounds = () => {
        return new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                if (currentValuedRounds.value && currentValuedRounds.value.length > 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    };

    watch([chartHeight, nodeRadius, nodeStrokeWidth, linkStrokeWidth, showCurrentMovesOnly], () => {
        if (treeContainer.value) {
            drawTree(treeData.value ? treeData.value : {
                position: "",
                positionValue: "",
                remoteness: 0,
                isUnexplored: true,
                children: []
            }, treeContainer.value);
        }
    });

    watch(currentPosition, (newPosition) => {
        if (!currentNode.value) return;

        if (currentNode.value.parentNode?.position === newPosition) {
            currentNode.value = currentNode.value.parentNode;
        } else {
            const childNode = currentNode.value.children?.find(child => child.position === newPosition);
            if (childNode) {
            currentNode.value = childNode;
            childNode.isUnexplored = false;

            if (childNode.children.length === 0) {

                const newChildren = Object.entries(currentValuedRounds.value[currentRoundId.value].position.availableMoves).map(([moveName, move]) => ({
                parentNode: childNode,
                position: move.position,
                positionValue: move.positionValue,
                moveValue: move.moveValue,
                remoteness: move.remoteness,
                winby: move.winby,
                drawLevel: move.drawLevel,
                drawRemoteness: move.drawRemoteness,
                isUnexplored: true,
                children: []
                }));

                childNode.children = [...childNode.children, ...newChildren];
                childNode.children = reactive(childNode.children);
            }
            }
        }

        treeData.value = { ...treeData.value! };
        if (treeContainer.value) {
            drawTree(treeData.value!, treeContainer.value);
        }
        });

</script>  

  
<style lang="scss" scoped>
    #tree-wrapper {
        width: 100%;
        min-height: 200px;
    }

    #meters {
        padding: 1rem 10%;

        >.meter {
            align-content: normal;
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding: 0.5rem;
            position: relative;

            >* {
                flex: 1 1 auto;
            }

            >.label {
                line-height: 1rem;
                max-width: 30%;
                text-align: left;
            }
        }
    }

    .draw {
        fill: var(--drawColor);
        stroke: var(--drawColor);
    }

    .tie {
        fill: var(--tieColor);
        stroke: var(--tieColor);
    }
    
    .lose {
        fill: var(--loseColor);
        stroke: var(--loseColor);
    }

    .win {
        fill: var(--winColor);
        stroke: var(--winColor);
    }

    .view-option {
        border: 0.1rem solid var(--neutralColor);
        border-radius: 1rem;
        margin: 1rem;
        padding: 1rem;
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
    }
</style>
