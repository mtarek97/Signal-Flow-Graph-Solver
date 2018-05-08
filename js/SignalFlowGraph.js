// this file contains the SignalFlowGraph object and its related methods to calculate the overall gain using mason's formula

// we need one object (= 1 Constructor Function) : SignalFlowGraph

function tryo(){
    var Graph = require("./graphlib").Graph;
    var g = new Graph();
    g.setNode("a","a");
    g.setNode("b","b");
    g.setNode("c","c");
    g.setNode("d","d");
    g.setNode("e","End");

    g.setEdge("a", "b");
    g.setEdge("b", "c");
    g.setEdge("c", "d");
    g.setEdge("d", "e");
    g.setEdge("b", "d");
    var stack = [];
    var data = getForwordPaths(g,stack,"a");
    for (var i = 0; i < data.length; i++){
        for (var j = 0; j < data[i].length; j++){
            this.console.log(data[i][j]);
        }
        this.console.log("\n");
    }

}



function getForwordPaths(graph,stack,startNode){
    var outEdges = graph.outEdges(startNode);
    stack.push(startNode);
    var forwordPaths = [];
    for(var i = 0; i < outEdges.length; i++){
        var node = outEdges[i]['w'];
        var data = [];
        if(node != "End" || stack.indexOf(node) != -1) {
            data = getForwordPaths(graph, stack, node);
        }
        stack.pop();
        for (var j = 0; j < data.length; j++){
            var path = [];
            path.push(startNode);
            for (var l = 0; l < data[j].length; l++){
                path.push(data[j][l]);
            }
            forwordPaths.push(path);
        }
    }
    if(outEdges.length == 0){
        var path = [];
        path.push(startNode);
        forwordPaths.push(path);
    }
    return forwordPaths;
}

tryo()