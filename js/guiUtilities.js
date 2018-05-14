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
