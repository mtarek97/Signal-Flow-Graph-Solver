// this file contains the SignalFlowGraph object and its related methods to calculate the overall gain using mason's formula

// we need one object (= 1 Constructor Function) : SignalFlowGraph

function tryo(){
    var Graph = require("./graphlib").Graph;
    var g = new Graph();
    g.setNode("a","a");
    g.setNode("b","b");
    g.setNode("c","c");
    g.setNode("d","d");
    g.setNode("e","e");
    g.setNode("End","End");
    g.setNode("g","g");

    g.setEdge("a", "b",{ k: 1 });
    g.setEdge("b", "c",{ k: 5 });
    g.setEdge("c", "d",{ k: 10 });
    g.setEdge("d", "e",{ k: 2 });
    g.setEdge("e", "End",{ k: 1 });
    g.setEdge("b", "g",{ k: 10 });
    g.setEdge("g", "e",{ k: 2 });
    g.setEdge("e", "b",{ k: -1 });
    g.setEdge("e", "d",{ k: -2 });
    g.setEdge("d", "c",{ k: -1 });
    g.setEdge("g", "g",{ k: -1 });

    var stack = [];
    var forwordPaths = getForwordPaths(g,stack,"a");
    var cycles = getCycles(g);
    var nontouching = getNonTouchingLoops(cycles);
    var result = getMasonsResult(g,forwordPaths,cycles,nontouching)
    this.console.log(result);


    /*for (var i = 0; i < data.length; i++){
        for (var j = 0; j < data[i].length; j++){
            this.console.log(data[i][j]);
        }
        this.console.log("\n");
        var path = data[0];
        this.console.log(getForwardGain(g,path));
    }*/
    //this.console.log(getCycleGain(g,data[0]));
    //this.console.log(getEdgeGian(g,"a","b"));*/
}



function getForwordPaths(graph,stack,startNode){
    var outEdges = graph.outEdges(startNode);
    stack.push(startNode);
    var flag = 0
    var forwordPaths = [];
    for(var i = 0; i < outEdges.length; i++){
        var node = outEdges[i]['w'];
        var data = [];
        if(stack.indexOf(node) == -1) {
            data = getForwordPaths(graph, stack, node);
            flag ++;
        }

        for (var j = 0; j < data.length; j++){
            var path = [];
            path.push(startNode);
            for (var l = 0; l < data[j].length; l++){
                path.push(data[j][l]);
            }
            forwordPaths.push(path);
        }
    }
    stack.pop();
    if(startNode == "End"){
        var path = [];
        path.push(startNode);
        forwordPaths.push(path);
    }
    return forwordPaths;
}

function getCycle(graph,startNode,nodesStack,stack){
    var outEdges = graph.outEdges(startNode);
    var data = [];
    stack.push(startNode);
    for(var i = 0; i < outEdges.length; i++){
        var node = outEdges[i]['w'];
        if(nodesStack.indexOf(node) == -1 && stack.indexOf(node) == -1) {
            var l = getCycle(graph, node, nodesStack, stack);
            for(var j = 0; j < l.length; j++){
                var cycle = [];
                cycle.push(startNode);
                for(var k = 0; k < l[j].length; k++){
                    cycle.push(l[j][k]);
                }
                data.push(cycle);
            }

        }
        if(stack.indexOf(node) == 0){
            var cycle = [];
            cycle.push(startNode);
            data.push(cycle);
        }

    }
    stack.pop();
    return data;
}

function getCycles(graph){

    var nodes = graph.nodes();
    var cycles = []
    var stacks = []
    for(var i = 0; i < nodes.length; i++){
        var stack = []
        var cycle = getCycle(graph, nodes[i], stacks, stack);
        for(var j = 0; j < cycle.length; j++){
            cycles.push(cycle[j]);
        }
        stacks.push(nodes[i]);
    }
    return cycles;
}

function isNonTouching(cycles){
    for(var i = 0; i < cycles.length; i++){
        for (var j = i+1; j < cycles.length; j++){
            if(!isTwoNonTouching(cycles[i],cycles[j])){
                return false;
            }
        }
    }
    return true;
}

function isTwoNonTouching(cycle1,cycle2) {
    for (var i = 0; i < cycle1.length; i++){
        for (var j = 0; j < cycle2.length; j++){
            if(cycle1[i] == cycle2[j]){
                return false;
            }
        }
    }
    return true;
}

function getNonTouchingLoops(cycles){
    var i = 2;
    var nonTouchingLoops = [];
    while(true){
        var allICompinations = k_combinations(cycles,i);
        var nontouchingICompination = []
        for(var j = 0; j < allICompinations.length; j++){
            if(isNonTouching(allICompinations[j])){
                nontouchingICompination.push(allICompinations[j]);
            }
        }
        if(nontouchingICompination.length == 0){
            break;
        }
        nonTouchingLoops.push(nontouchingICompination);
        i++
    }
    return nonTouchingLoops;
}

function getForwardGain(graph,path) {
    var gain = 1;
    for (var i = 0; i < path.length-1;i++){
        var edgeGain = getEdgeGian(graph,path[i],path[i+1]);
        gain = gain * edgeGain;
    }
    return gain
}


function getCycleGain(graph,path) {
    var tempGain = getForwardGain(graph,path);
    return tempGain * getEdgeGian(graph,path[path.length-1],path[0]);
}

function getEdgeGian(graph, node1, node2){
    return graph.edge(node1,node2)['k'];
}

function getDelta(graph,cycles,nontouchingLoops) {
    var delta = 1;
    if(cycles.length == 0){
        return delta;
    }else {
        var sum = 0;
        for(var i = 0; i < cycles.length; i++){
            sum = sum + getCycleGain(graph,cycles[i]);
        }
        delta = delta - sum;
        var flag = 1;
        var sumOfmultipliedLoops = getSumOfMultipliedLoops(graph,nontouchingLoops);
        for (var i = 0; i < sumOfmultipliedLoops.length; i++){
            delta = delta + flag * sumOfmultipliedLoops[i];
            flag = flag * -1;
        }
    }
    return delta;
}

function getSumOfMultipliedLoops(graph,nontouchingLoops) {
    var sumOfmultipliedLoops = [];
    for(var i = 0; i < nontouchingLoops.length; i++){
        var sum = 0;
        for (var j = 0; j < nontouchingLoops[i].length; j++){
            sum = sum + getMultipliedLoops(graph,nontouchingLoops[i][j]);
        }
        sumOfmultipliedLoops.push(sum);
    }
    return sumOfmultipliedLoops;
}

function getMultipliedLoops(graph,arrayOfLoops) {
    var gain = 1;
    for (var i = 0; i < arrayOfLoops.length; i++){
        gain = gain * getCycleGain(graph,arrayOfLoops[i]);
    }
    return gain;
}

function getValidCyclesWithPath(path,cycles) {
    var validCycles = []
    for(var i = 0; i < cycles.length; i++){
        var flag = 0;
        for (var j = 0; j < path.length; j++){
            if(cycles[i].indexOf(path[j]) != -1){
                flag ++;
                break;
            }
        }
        if(flag == 0){
            validCycles.push(cycles[i]);
        }
    }
    return validCycles;
}

function getMasonsResult(graph,forwordPaths,cycles,nonTOuchingLoops) {
    var delta = getDelta(graph,cycles,nonTOuchingLoops);
    var forwordPathsDeltaGain = 0;
    for(var i = 0; i < forwordPaths.length; i++){
        var pathGain = getForwardGain(graph,forwordPaths[i]);
        var validPathCycles = getValidCyclesWithPath(forwordPaths[i],cycles);
        var pathDelta = getDelta(graph,validPathCycles,getNonTouchingLoops(validPathCycles));
        forwordPathsDeltaGain = forwordPathsDeltaGain + pathGain*pathDelta;
    }
    return forwordPathsDeltaGain /(delta * 1.0);
}

function k_combinations(set, k) {
    var i, j, combs, head, tailcombs;

    // There is no way to take e.g. sets of 5 elements from
    // a set of 4.
    if (k > set.length || k <= 0) {
        return [];
    }

    // K-sized set has only one K-sized subset.
    if (k == set.length) {
        return [set];
    }

    // There is N 1-sized subsets in a N-sized set.
    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }

    // Assert {1 < k < set.length}

    // Algorithm description:
    // To get k-combinations of a set, we want to join each element
    // with all (k-1)-combinations of the other elements. The set of
    // these k-sized sets would be the desired result. However, as we
    // represent sets with lists, we need to take duplicates into
    // account. To avoid producing duplicates and also unnecessary
    // computing, we use the following approach: each element i
    // divides the list into three: the preceding elements, the
    // current element i, and the subsequent elements. For the first
    // element, the list of preceding elements is empty. For element i,
    // we compute the (k-1)-computations of the subsequent elements,
    // join each with the element i, and store the joined to the set of
    // computed k-combinations. We do not need to take the preceding
    // elements into account, because they have already been the i:th
    // element so they are already computed and stored. When the length
    // of the subsequent list drops below (k-1), we cannot find any
    // (k-1)-combs, hence the upper limit for the iteration:
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1);
        // We take smaller combinations from the subsequent elements
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}



tryo()