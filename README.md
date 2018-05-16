# Signal Flow Graph Solver

> An interactive signal flow graph solver that allows the user to create his signal flow graph using drag and drop mode and compute the overall gain.

## Getting Started

### User Guide

The program allows the user to create the graph very easily with the buttons that we provide in a toolbar <br/>
![alt toolbar](https://i.imgur.com/uTBnqEf.png)
* The user can add a node or remove it
* Then add the branches between nodes
* The user can clear all the graph and reconstruct it
* The user is able to rename the nodes names and branches gains
* Then user should select the source and the end nodes
* Then he can solve the graph using mason’s rule

The program allows the user to save his graph as JSON and load it whenever he wants <br/>
![alt saving](https://i.imgur.com/r1Ym2ds.png)
* To save the graph he just should clcik the save button
* To load it he should choose the json file

The user has the ability to take a snapshot of the graph as jpg image <br/>
![alt snapshot](https://i.imgur.com/LZNHPTN.png)
* To take the snapshot the user can fit the graph first to the center of the screen and then take the snapshot

### Sample Run
![alt graph](https://i.imgur.com/JBK0qrD.png)
![alt output](https://i.imgur.com/CBNou2E.png)

## Built With
* Javascript - The programming language used
* [graphlib.js](https://github.com/dagrejs/graphlib) - a javascript library that provides data structures for undirected and directed multi-graphs along with algorithms that can be used with them. It is used for the solving logic.
* [cytoscape.js](http://js.cytoscape.org/) - a javascript Graph theory / network library for visualisation and analysis. It is used for the GUI.

## Authors
* **Mahmoud Tarek** - [MahmoudTarek97](https://github.com/MahmoudTarek97)
* **Mostafa Labib** - [mostafaLabib65](https://github.com/mostafaLabib65/)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
