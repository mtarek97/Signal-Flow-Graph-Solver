var nodesCount = 0;
var edgesCount = 0;

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

// 0 -> should select from node
// 1 -> should select to node
var addBranchState = 0;

var addBranchPressed = false;

function addBranch() {
    setaddBranchPressed(!addBranchPressed)
    setRemovePressed(false)
}

function addNode() {
    setRemovePressed(false)
    setaddBranchPressed(false)
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
            href: 'http://cytoscape.org'
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


var duplicateEdge = function (fromId, toId, gain) {
    duplicate = false;
    console.log("here 1");
    cy.edges().forEach(function (edge) {
        console.log(edge.data.source + "  " + edge.data.target);
        console.log("here 1");
        if (edge.data.source == fromId && edge.data.target == toId) {
            edge.data.name = (Number(edge.data.name) + gain).toString();
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

resizeGraph();
// adapt the stage on any window resize
window.addEventListener('resize', resizeGraph);
printAllnode(); //debugging
