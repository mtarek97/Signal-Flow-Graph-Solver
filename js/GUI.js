var nodesCount = 0;
var edgesCount = 0;
var nodes = []
var edges = []

function resizeGraph() {
    var container = cy.container();
    container.style.width = '100%';
    container.style.height = '100%';
    cy.resize();
    cy.fit();
    var currentWidth = container.clientWidth;
    var currentHeight = container.clientHeight;
    console.log(currentWidth + "   " + currentWidth);
}

// 0 -> should select "from" node
// 1 -> should select "to" node
var addBranchState = 0;

var addBranchPressed = false;

function addBranch() {
    setaddBranchPressed(!addBranchPressed)
    setRemovePressed(false)
    setEditLabelPressed(false);
}

function editLabel() {
    setaddBranchPressed(false);
    setRemovePressed(false);
    setEditLabelPressed(!editLabelPressed);
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

var editNodeLabelHandler = function (evt) {
    if (editLabelPressed) {
        var node = evt.target;
        var newName = prompt("Please enter the new label", "");
        if (newName == null || newName == "") {
            console.log("User cancelled the prompt.");
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
        } else {
            console.log(newGain);
        }
        edge.data('name', newGain);
    }
};


function addNode() {
    setRemovePressed(false)
    setaddBranchPressed(false)
    setEditLabelPressed(false);
    nodesCount++;
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
            name: 'default'
        },
        position: {
            x: x,
            y: y
        }
    };
    newNode.data.id = "node" + nodesCount.toString();
    newNode.data.name = nodesCount.toString();
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
        console.log(node.id() + " has been removed");
    }

};

var removeEdgeHandler = function (evt) {
    if (removePressed) {
        var edge = evt.target;
        cy.remove(edge);
        console.log(edge.id() + " has been removed");
    }
};


// TODO
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
            if (fromNode.id() == toNode.id()) {
                alert("Signal flow graph can't have self loops!")
                setaddBranchPressed(false)
                return;
            }
            var gain = prompt("Please enter the gain value", "");
            if (gain == null || gain == "") {
                console.log("User cancelled the prompt.");
                setaddBranchPressed(false)
                return;
            } else {
                console.log(gain)
            }
            duplicate = duplicateEdge(fromNode.id(), toNode.id(), gain);
            if (duplicate) {
                alert("gain has been added to the duplicate branch")
                setaddBranchPressed(false)
                return;
            }
            edgesCount++;
            var newEdge = {
                group: "edges",
                data: {
                    href: 'http://cytoscape.org'
                }
            };
            newEdge.data.id = "edge" + edgesCount.toString();
            newEdge.data.name = gain;
            newEdge.data.source = fromNode.id();
            newEdge.data.target = toNode.id();
            console.log(newEdge.data.id);
            cy.add(newEdge);
            newEdge = cy.getElementById(newEdge.data.id)
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
}


function printAllnode() {
    // print all the ids of the nodes in the graph
    cy.nodes().forEach(function (ele) {
        console.log(ele.id());
    });
}


function changeClass(object, oldClass, newClass) {
    // remove:
    //object.className = object.className.replace( /(?:^|\s)oldClass(?!\S)/g , '' );
    // replace:
    var regExp = new RegExp('(?:^|\\s)' + oldClass + '(?!\\S)', 'g');
    object.className = object.className.replace(regExp, newClass);
    // add
    //object.className += " "+newClass;
}



function clearAll() {
    setaddBranchPressed(false)
    setRemovePressed(false)
    setEditLabelPressed(false);
    cy.nodes().forEach(function (ele) {
        cy.remove(ele);
    });
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
            'text-outline-width': 2,
            'text-outline-color': '#1970fc',
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
        }),

    //    elements: {
    //        nodes: [
    //            {
    //                data: {
    //                    id: 'node0',
    //                    name: 'Labib',
    //                }
    //            },
    //            {
    //                data: {
    //                    id: 'node1',
    //                    name: 'A',
    //                }
    //            },
    //            {
    //                data: {
    //                    id: 'node2',
    //                    name: 'B',
    //                }
    //            }
    //
    //    ],
    //        edges: [
    //            {
    //                data: {
    //                    id: 'edge0',
    //                    source: 'node0',
    //                    target: 'node2',
    //                    name: '245'
    //                }
    //            }
    //            , {
    //                data: {
    //                    id: 'edge1',
    //                    source: 'node1',
    //                    target: 'node2',
    //                    name: '6'
    //                }
    //            },
    //            {
    //                data: {
    //                    id: 'edge2',
    //                    source: 'node2',
    //                    target: 'node0',
    //                    name: '456'
    //                }
    //            }
    //    ]
    //    },

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

resizeGraph();
// adapt the stage on any window resize
window.addEventListener('resize', resizeGraph);
printAllnode(); //debugging
