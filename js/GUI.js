var nodesCount = 3;

function resizeGraph() {
    var container = cy.container();
    container.style.width = '100%';
    container.style.height = '100%';
    cy.resize();
    cy.fit();
    var currentWidth = container.clientWidth;
    var currentHeight = container.clientWidth;
    console.log(currentWidth + "   " + currentWidth);
}

function addBranch() {
    alert("addBranch: not working yet");
}

function addNode() {
    nodesCount++;
    var newNode = {
        group: "nodes",
        data: {
            href: 'http://cytoscape.org'
        }
    };
    newNode.data.id = nodesCount.toString();
    newNode.data.name = nodesCount.toString();
    console.log(newNode.name);
    cy.add(newNode);
    resizeGraph();
}


function remove() {
    cy.one('tap', 'node', function (evt) {
        var node = evt.target;
        cy.remove(node);
        console.log("node " + node.id() + " has been removed");
    });
}


function printAllnode() {
    // print all the ids of the nodes in the graph
    cy.nodes().forEach(function (ele) {
        console.log(ele.id());
    });
}


function clearAll() {
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

    elements: {
        nodes: [
            {
                data: {
                    id: '0',
                    name: 'Labib',
                }
            },
            {
                data: {
                    id: '2',
                    name: 'A',
                }
            },
            {
                data: {
                    id: '1',
                    name: 'B',
                }
            }

    ],
        edges: [
            {
                data: {
                    id: '6',
                    source: '0',
                    target: '2',
                    name: '245'
                }
            }
            , {
                data: {
                    id: '7',
                    source: '1',
                    target: '2',
                    name: '6'
                }
            },
            {
                data: {
                    id: '8',
                    source: '2',
                    target: '0',
                    name: '456'
                }
            }
    ]
    },

    layout: {
        name: 'grid'
    }
});

console.log("hey");



resizeGraph();
// adapt the stage on any window resize
window.addEventListener('resize', resizeGraph);
printAllnode();
