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
    g.setNode("f","f");
    g.setNode("g","End");

    g.setEdge("a", "b",{ k: 1 });
    g.setEdge("b", "c",{ k: 2 });
    g.setEdge("c", "d",{ k: 4 });
    g.setEdge("d", "e",{ k: 5 });
    g.setEdge("e", "f",{ k: 6 });
    g.setEdge("f", "g",{ k: 7 });
    g.setEdge("c", "a",{ k: 7 });
    g.setEdge("e", "d");
    g.setEdge("f", "d");
    g.setEdge("g", "f");
    g.setEdge("b", "d");
    var stack = [];
    var data = getCycles(g);
   // var nontouching = getNonTouchingLoops(data);
    /*for (var i = 0; i < data.length; i++){
        for (var j = 0; j < data[i].length; j++){
            this.console.log(data[i][j]);
        }
        this.console.log("\n");
        var path = data[0];
        this.console.log(getForwardGain(g,path));
    }*/
    this.console.log(getCycleGain(g,data[0]));
    //this.console.log(getEdgeGian(g,"a","b"));
}



function getForwordPaths(graph,stack,startNode){
    var outEdges = graph.outEdges(startNode);
    stack.push(startNode);
    var flag = 0
    var forwordPaths = [];
    for(var i = 0; i < outEdges.length; i++){
        var node = outEdges[i]['w'];
        var data = [];
        if(node != "End" && stack.indexOf(node) == -1) {
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
    if(outEdges.length == 0 || flag == 0){
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

function getDelta(cycles,nontouchingLoops) {
    var delta = 1;
    if(cycles.length == 0){
        return delta;
    }else {
        var sum = 0;
        for(var i = 0; i < cycles.length; i++){
            sum = sum + getCycleGain(cycles[i]);
        }
        delta = delta - sum;

    }
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