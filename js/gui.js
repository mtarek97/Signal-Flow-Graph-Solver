var nodesCount = 0;
var edgesCount = 0;
var nodesIdsCount = 0;
var edgesIdsCount = 0;


// 0 -> should select "from" node
// 1 -> should select "to" node
var addBranchState = 0;

var addBranchPressed = false;

function getNodeSolvingId(nodeId) {
    var node = cy.nodes("[id='" + nodeId + "']");
    var id;
    if (node.data('isStart')) {
        id = "Start";
    } else if (node.data('isEnd')) {
        id = "End";
    } else {
        id = node.data('id');
    }
    return id;
}

function showOutput(result, paths, cycles, nonTouchingLoops, delta, pathsDelta) {
    // result
    resultText = document.getElementById('result');
    resultText.innerHTML = "overall gain = " + result;

    //paths
    forwardPathsText = document.getElementById('forwardPaths');
    forwardPathsText.innerHTML = "";
    for (i = 1; i <= paths.length; i++) {
        forwardPathsText.innerHTML += "M" + i + " : {" + paths[i - 1].join('-') + "}<br>";
    }

    //cycles
    cyclesText = document.getElementById('cycles');
    cyclesText.innerHTML = "";
    for (i = 1; i <= cycles.length; i++) {
        cyclesText.innerHTML += "L" + i + " : {" + cycles[i - 1].join('-') + "}<br>";
    }

    //non touching loops
    nonTouchingLoopsText = document.getElementById('nonTouchingLoops');
    //nonTouchingLoopsText.innerHTML = joinSubArrays(nonTouchingLoops, '<br> ');
    for (i = 1; i <= nonTouchingLoops.length; i++) {
        nonTouchingLoopsText.innerHTML += i + 1 + "-non touching : <br>";
        for (j = 1; j <= nonTouchingLoops[i - 1].length; j++) {
            for (k = 1; k <= nonTouchingLoops[i - 1][j - 1].length; k++) {
                nonTouchingLoopsText.innerHTML += "{" + nonTouchingLoops[i - 1][j - 1][k - 1].join('-') + "}  &nbsp;";
            }
            nonTouchingLoopsText.innerHTML += "<br>";
        }
    }

    //deltas
    deltasText = document.getElementById('deltas');
    deltasText.innerHTML = "";
    deltasText.innerHTML += "&Delta; = " + delta + "<br>";
    console.log(pathsDelta.length);
    for (i = 1; i <= pathsDelta.length; i++) {
        deltasText.innerHTML += "&Delta;" + i + " = " + pathsDelta[i - 1].toString() + "<br>";
    }

}

function solve() {
    if (!nodeAlreadySelected('isStart')) {
        alert("you must set the source node");
        return;
    }
    if (!nodeAlreadySelected('isEnd')) {
        alert("you must set the end node");
        return;
    }
    var g = new graphlib.Graph();
    // add nodes
    cy.nodes().forEach(function (node) {
        name = node.data('name');
        id = getNodeSolvingId(node.data('id'));
        console.log("node added, id : " + id + " ,name: " + name)
        g.setNode(id, name);
    });
    //add edges
    cy.edges().forEach(function (edge) {
        gain = Number(edge.data('name'));
        source = getNodeSolvingId(edge.data('source'));
        target = getNodeSolvingId(edge.data('target'));
        g.setEdge(source, target, {
            k: gain
        });
        console.log("edge added, start : " + source + " ,target: " + target + " ,gain:" + gain)
    });

    // how to get the final result
    var stack = [];
    var forwardPaths = getForwordPaths(g, stack, "Start");
    var cycles = getCycles(g);
    var nontouching = getNonTouchingLoops(cycles);
    var result = getMasonsResult(g, forwardPaths, cycles, nontouching);
    console.log(result);

    // show output
    var pathsByNames = getNames(g, forwardPaths);
    var cyclesByNames = getNames(g, cycles);
    var nonTouchingLoopsByNames = getNonTouchingLoopsNames(g, nontouching);
    console.log(pathsByNames);
    console.log(cyclesByNames);
    console.log(nonTouchingLoopsByNames);

    // how to get delta
    var delta = getDelta(g, cycles, nontouching);
    console.log("delta : " + delta);

    // how to get delta i's
    pathsDelta = []
    for (i = 0; i < forwardPaths.length; i++) {
        var validPathCycles = getValidCyclesWithPath(forwardPaths[i], cycles);
        var pathDelta = getDelta(g, validPathCycles, getNonTouchingLoops(validPathCycles));
        pathsDelta.push(pathDelta)
        console.log("delta" + i + " : " + pathDelta);
    }

    showOutput(result, pathsByNames, cyclesByNames, nonTouchingLoopsByNames, delta, pathsDelta);
    // animatePaths(forwardPaths);



}

function snapShot() {
    var jpg64 = cy.jpg();
    var a = document.getElementById('sfg');
    var url = jpg64.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
    a.href = url;
    a.click()
}


function addBranch() {
    setaddBranchPressed(!addBranchPressed)
    setRemovePressed(false)
    setEditLabelPressed(false);
    setEndPressed(false);
    setStartPressed(false);
}

function editLabel() {
    setaddBranchPressed(false);
    setRemovePressed(false);
    setEditLabelPressed(!editLabelPressed);
    setEndPressed(false);
    setStartPressed(false);
}

function setEditLabelPressed(pressed) {
    editLabelBtn = document.getElementById('editLabel');
    if (pressed) {
        editLabelPressed = true;
        changeClass(editLabelBtn, "button", " hold-button");
    } else {
        editLabelPressed = false;
        changeClass(editLabelBtn, "hold-button", " button");
    }
}

function duplicateNodeName(name) {
    var duplicate = false;
    cy.nodes().forEach(function (ele) {
        if (ele.data('name') == name) {
            duplicate = true;
        }
    });
    return duplicate;
}

var editNodeLabelHandler = function (evt) {
    if (editLabelPressed) {
        var node = evt.target;
        var newName = prompt("Please enter the new label", "");
        if (newName == null || newName == "") {
            console.log("User cancelled the prompt.");
            setEditLabelPressed(false)
            return;
        } else if (duplicateNodeName(newName)) {
            alert("duplicate name");
            setEditLabelPressed(false)
            return;
        } else {
            console.log(newName);
        }
        node.data('name', newName);
    }

};

var editEdgeLabelHandler = function (evt) {
    if (editLabelPressed) {
        var edge = evt.target;
        var newGain = prompt("Please enter the new gain", "");
        if (newGain == null || newGain == "") {
            console.log("User cancelled the prompt.");
            setEditLabelPressed(false)
            return;
        } else if (isNaN(newGain)) {
            alert("Gain value must be a number");
            return;
        } else {
            console.log(newGain);
        }
        edge.data('name', newGain);
    }
};

startPressed = false;
endPressed = false;


function setStartPressed(pressed) {
    setStartBtn = document.getElementById('start');
    if (pressed) {
        startPressed = true;
        changeClass(setStartBtn, "button", " hold-button");
    } else {
        startPressed = false;
        changeClass(setStartBtn, "hold-button", " button");
    }
}

function setEndPressed(pressed) {
    setEndBtn = document.getElementById('end');
    if (pressed) {
        endPressed = true;
        changeClass(setEndBtn, "button", " hold-button");
    } else {
        endPressed = false;
        changeClass(setEndBtn, "hold-button", " button");
    }
}

function setStart() {
    setaddBranchPressed(false)
    setRemovePressed(false)
    setEditLabelPressed(false);
    setEndPressed(false);
    setStartPressed(!startPressed);
}

function setEnd() {
    setaddBranchPressed(false)
    setRemovePressed(false)
    setEditLabelPressed(false);
    setEndPressed(!endPressed);
    setStartPressed(false);
}

function nodeAlreadySelected(state) {
    selected = false;
    cy.nodes().forEach(function (ele) {
        if (ele.data(state)) {
            selected = true;
        }
    });
    return selected;
}

// blue #1970fc

var setStartHandler = function (evt) {
    if (startPressed) {
        var node = evt.target;
        if (node.data('isStart')) {
            node.data('isStart', false)
            node.style('background-color', '#1970fc')
        } else if (node.data('isEnd')) {
            alert("start node and end node can't be the same!")
        } else {
            if (nodeAlreadySelected('isStart')) {
                alert("you already selected the start node!")
            } else {
                node.data('isStart', true)
                node.style('background-color', 'green')
                console.log("start node is " + node.id())
            }
        }
    }

};

var setEndHandler = function (evt) {
    if (endPressed) {
        var node = evt.target;
        if (node.data('isEnd')) {
            node.data('isEnd', false)
            node.style('background-color', '#1970fc')
        } else if (node.data('isStart')) {
            alert("start node and end node can't be the same!")
        } else {
            if (nodeAlreadySelected('isEnd')) {
                alert("you already selected the end node!")
            } else {
                node.data('isEnd', true)
                node.style('background-color', 'red')
                console.log("end node is " + node.id())
            }
        }
    }

};

function addNode() {
    setRemovePressed(false)
    setaddBranchPressed(false)
    setEditLabelPressed(false);
    setEndPressed(false);
    setStartPressed(false);
    nodesCount++;
    nodesIdsCount++;
    var maxXpos = 0;
    cy.nodes().forEach(function (node) {
        if (node.position('x') > maxXpos) {
            maxXpos = node.position('x');
        }
    });
    x = maxXpos + 130;
    y = cy.container().clientHeight / 2;
    var newNode = {
        group: "nodes",
        data: {
            id: "node" + nodesIdsCount.toString(),
            name: nodesCount.toString(),
            isStart: false,
            isEnd: false
        },
        position: {
            x: x,
            y: y
        }
    };
    console.log(newNode.data.id);
    cy.add(newNode);
    resizeGraph();
}


removePressed = false;
editLabelPressed = false;

var removeNodeHandler = function (evt) {
    if (removePressed) {
        var node = evt.target;
        cy.remove(node);
        nodesCount--;
        console.log(node.id() + " has been removed");
    }

};

var removeEdgeHandler = function (evt) {
    if (removePressed) {
        var edge = evt.target;
        cy.remove(edge);
        edgesCount--;
        console.log(edge.id() + " has been removed");
    }
};

var duplicateEdge = function (fromId, toId, gain) {
    duplicate = false;
    console.log("here 1");
    cy.edges().forEach(function (ele) {
        oldFromId = ele.data('source');
        oldToId = ele.data('target');
        console.log("here 2");
        if (oldFromId == fromId && oldToId == toId) {
            oldGain = ele.data('name');
            ele.data('name', (Number(oldGain) + Number(gain)));
            duplicate = true;
        }
    });
    return duplicate;
}

var fromNode, toNode;
var addBranchHandler = function (evt) {
    if (addBranchPressed) {
        if (addBranchState == 0) {
            fromNode = evt.target;
            console.log("first")
            addBranchState = 1;
        } else if (addBranchState == 1) {
            toNode = evt.target;
            console.log("second")
            var gain = prompt("Please enter the gain value", "");
            gain = gain.trim();
            if (gain == null || gain == "") {
                console.log("User cancelled the prompt.");
                setaddBranchPressed(false)
                return;
            } else if (isNaN(gain)) {
                alert("Gain value must be a number!");
                setaddBranchPressed(false)
                return;
            } else {
                console.log(gain)
            }
            duplicate = duplicateEdge(fromNode.id(), toNode.id(), gain);
            if (duplicate) {
                setaddBranchPressed(false)
                return;
            }
            edgesCount++;
            edgesIdsCount++;
            var newEdge = {
                group: "edges",
                data: {
                    id: "edge" + edgesIdsCount.toString(),
                    name: gain,
                    source: fromNode.id(),
                    target: toNode.id()
                }
            };
            console.log(newEdge.data.id);
            cy.add(newEdge);
            newEdge = cy.getElementById(newEdge.data.id)
            if (newEdge.isLoop()) {
                newEdge.style('loop-direction', '0deg');
                newEdge.style('loop-sweep', '-45deg');
                newEdge.style('control-point-distances', [-43, 50, -43]);
                console.log("loop");
                resizeGraph();
                setaddBranchPressed(false);
                return;
            }
            diff = Math.abs(fromNode.position('x') - toNode.position('x'))
            controlPoints = [(-100 - 5 * diff) / 8, (-100 - 3 * diff) / 8, (100 + diff) / 6, (-100 - 3 * diff) / 8, (-100 - 5 * diff) / 8]
            console.log(controlPoints)
            newEdge.style('control-point-distances', controlPoints)
            resizeGraph();
            console.log("finish add branch")
            setaddBranchPressed(false)
        }
    }
}

function setRemovePressed(pressed) {
    removeBtn = document.getElementById('remove');
    if (pressed) {
        removePressed = true;
        changeClass(removeBtn, "button", " hold-button");
    } else {
        removePressed = false;
        changeClass(removeBtn, "hold-button", " button");
    }
}


function setaddBranchPressed(pressed) {
    addBranchBtn = document.getElementById('addBranch');
    if (pressed) {
        addBranchPressed = true;
        changeClass(addBranchBtn, "button", " hold-button");
    } else {
        addBranchState = 0;
        addBranchPressed = false;
        changeClass(addBranchBtn, "hold-button", " button");
    }
}

function activateRemove() {
    setaddBranchPressed(false);
    setEditLabelPressed(false);
    setRemovePressed(!removePressed);
    setEndPressed(false);
    setStartPressed(false);
}


function printAllnode() {
    // print all the ids of the nodes in the graph
    cy.nodes().forEach(function (ele) {
        console.log(ele.id());
    });
}

function clearAll() {
    setaddBranchPressed(false)
    setRemovePressed(false)
    setEditLabelPressed(false);
    setEndPressed(false);
    setStartPressed(false);
    cy.nodes().forEach(function (ele) {
        cy.remove(ele);
    });
    nodesCount = 0;
    edgesCount = 0;
    console.log("graph has been destroyed!");
}

var cy = cytoscape({
    container: document.getElementById('cy'),

    boxSelectionEnabled: false,
    autounselectify: true,
    maxZoom: 5,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    selectionType: 'single',

    style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'content': 'data(name)',
            'text-valign': 'center',
            'color': 'white',
            'background-color': '#1970fc',
        })
        .selector(':selected')
        .css({
            'border-width': 50,
            'border-color': '#333',
            'background-color': 'black',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'text-outline-color': 'black'
        })
        .selector('edge')
        .css({
            'content': 'data(name)',
            'text-valign': 'center',
            'color': 'white',
            'text-outline-width': 2,
            'text-outline-color': '#6FB1FC',
            'curve-style': 'unbundled-bezier',
            'target-arrow-shape': 'triangle',
            'line-color': '#6FB1FC',
            'target-arrow-color': '#6FB1FC'
        }).selector('.highlighted')
        .css({
            'background-color': 'black',
            'line-color': 'gray',
            'target-arrow-color': 'gray',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        }),
    layout: {
        name: 'grid'
    }
});

console.log("hey");
cy.on('tap', 'node', removeNodeHandler);
cy.on('tap', 'edge', removeEdgeHandler);
cy.on('tap', 'node', addBranchHandler);
cy.on('tap', 'node', editNodeLabelHandler);
cy.on('tap', 'edge', editEdgeLabelHandler);
cy.on('tap', 'node', setStartHandler);
cy.on('tap', 'node', setEndHandler);

resizeGraph();
// adapt the stage on any window resize
window.addEventListener('resize', resizeGraph);
printAllnode(); //debugging
