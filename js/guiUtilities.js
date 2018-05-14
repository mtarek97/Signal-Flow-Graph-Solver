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


function changeClass(object, oldClass, newClass) {
    // remove:
    //object.className = object.className.replace( /(?:^|\s)oldClass(?!\S)/g , '' );
    // replace:
    var regExp = new RegExp('(?:^|\\s)' + oldClass + '(?!\\S)', 'g');
    object.className = object.className.replace(regExp, newClass);
    // add
    //object.className += " "+newClass;
}

/**
 * Check for the various File API support.
 */
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}


function setNodesEdgesIdsCount() {
    maxNodeId = 0;
    cy.nodes().forEach(function (node) {
        id = Number(node.id().substring(4));
        if (id > maxNodeId) {
            maxNodeId = id;
        }
    });
    nodesIdsCount = maxNodeId;
    console.log(nodesIdsCount);

    maxEdgeId = 0;
    cy.edges().forEach(function (edge) {
        id = Number(edge.id().substring(4));
        if (id > maxEdgeId) {
            maxEdgeId = id;
        }
    });
    edgesIdsCount = maxEdgeId;
    console.log(edgesIdsCount);
}

var reader;
/**
 * read text input
 */
function readText(filePath) {
    var elements, input = "";
    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            input = e.target.result;
            console.log(input);
            input = JSON.parse(input);
            console.log(input);
            clearAll();
            cy.json(input);
            setNodesEdgesIdsCount()
            console.log(cy.elements())
        };
        reader.readAsText(filePath.files[0]);
    } else {
        return false;
    }
    return true;
}


function saveAsJSON(filename) {
    var cyString = JSON.stringify(cy.json());
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cyString));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log(cyString);
}
