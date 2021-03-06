import {pieces} from './pieces';
import {RootObject, DataObject, ColumnObject, PieceDataObject} from './dlxClasses';
import {Piece} from './Piece';
import {Node} from './Node';

// Prepare for DLX
function createXListForExactCoverProblem(arr) {
    const header = createInitialXList(arr);
    for (let p = 0, piece, nodes; p < pieces.length; p++) {
        piece = pieces[p];
        nodes = piece.nodes;
        for (let i = 0; i + piece.maxrow < arr.length; i++) {
            for (let j = 0; j + piece.maxcol < arr[i].length; j++) {
                if (isMatch(arr, nodes, i, j)) {
                    addNewRow(header, nodes, i, j);
                }
            }
        }
    }

    return header;
}

//create initial Xlist with header and empty columns
function createInitialXList(arr) {
    const header = new RootObject({});
    let previousColumn = header;
    let currentColumn, node;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == 0) {
                // do I need nodeToString and stringToNode???
                node = new Node(i, j);
                currentColumn = new ColumnObject({left: previousColumn, name: node});
                currentColumn.up = currentColumn;
                currentColumn.down = currentColumn;
                currentColumn.column = currentColumn;
                previousColumn.right = currentColumn;
                previousColumn = currentColumn;
            }
        }
    }
    currentColumn.right = header;
    header.left = currentColumn;
    return header;
}

function isMatch(arr, nodes, i, j) {
    for (let k = 0; k < nodes.length; k++) {
        if (arr[i + nodes[k].row][j + nodes[k].column] == 1) {
            return false;
        }
    }
    return true;
}

//TODO: (only  a note for a programmer) nodes should be sorted in a right order
function addNewRow(header, nodes, row, column) {
    let node = nodes[0];
    let currentNode = new Node(node.row + row, node.column + column);

    let data, startRowData = addNewDataObject(header, currentNode);
    let previousData = startRowData;

    for (let n = 1; n < nodes.length; n++) {
        node = nodes[n];
        currentNode = new Node(node.row + row, node.column + column);
        data = addNewDataObject(header, currentNode, previousData);
        previousData.right = data;
        previousData = data;
    }

    startRowData.left = data;
    data.right = startRowData;
}

function addNewDataObject(header, currentNode, previousData) {
    const current = findColumnForNode(header, currentNode);
    if (current === undefined) {
        return;
    }

    const data = new DataObject({column: current, down: current, up: current.up, left: previousData});

    data.up.down = data;
    data.down.up = data;
    current.size++;

    return data;
}

function findColumnForNode(header, node) {
    let current = header.right;
    while (current != header) {
        if (current.name.equalsTo(node)) {
            return current;
        }
        current = current.right;
    }
    return undefined;
}

// DLX algorithm
function searchDLX(header, solution, k) {
    if (header.right == header) {
        return true;
    }
    else {
        let isSolutionFound = false;
        let current = chooseColumn(header);
        coverColumn(current);
        let row = current.down;

        while (row != current && !isSolutionFound) {
            solution[k] = row;

            let j = row.right;
            while (j != row) {
                coverColumn(j.column);
                j = j.right;
            }
            isSolutionFound = searchDLX(header, solution, k + 1);
            row = solution[k];
            current = row.column;
            j = row.left;
            while (j != row) {
                uncoverColumn(j.column);
                j = j.left;
            }
            row = row.down;
        }

        uncoverColumn(current);
        return isSolutionFound;
    }
}

function chooseColumn(header) {
    let j = header.right;
    let current = j;
    let size = j.size;

    while (j != header) {
        if (j.size < size) {
            current = j;
            size = j.size;
        }
        j = j.right;
    }

    return current;
}

function coverColumn(current) {
    current.right.left = current.left;
    current.left.right = current.right;
    let i = current.down;
    while (i != current) {
        let j = i.right;
        while (j != i) {
            j.down.up = j.up;
            j.up.down = j.down;
            j.column.size--;

            j = j.right;
        }

        i = i.down;
    }
}

function uncoverColumn(current) {
    let i = current.up;
    while (i != current) {
        let j = i.left;
        while (j != i) {
            j.column.size++;
            j.down.up = j;
            j.up.down = j;

            j = j.left;
        }

        i = i.up;
    }
    current.right.left = current;
    current.left.right = current;
}

function printDLX(solution) {
    let pieces = [];
    //console.log(`Solution(${solution.length} pieces):`);
    for (let i = 0; i < solution.length; i++) {
        let o = solution[i];
        let f = solution[i].left;
        let str = '';
        let nodes = [];
        while (o != f) {
            nodes.push(o.column.name.toArray());
            str += `${o.column.name.toString()}   `;
            o = o.right;
        }
        nodes.push(o.column.name.toArray());
        str += o.column.name.toString();
        pieces.push(new Piece(nodes));
        //console.log(str);
    }
    return pieces;
}

// functions with piece constraints
function createXListForExactCoverProblemWithPiece(arr) {
    const header = createInitialXList(arr);
    for (let p = 0, piece, nodes; p < pieces.length; p++) {
        piece = pieces[p];
        nodes = piece.nodes;
        for (let i = 0; i + piece.maxrow < arr.length; i++) {
            for (let j = 0; j + piece.maxcol < arr[i].length; j++) {
                if (isMatch(arr, nodes, i, j)) {
                    addNewRowWithPiece(header, nodes, i, j, piece);
                }
            }
        }
    }

    return header;
}

function addNewRowWithPiece(header, nodes, row, column, piece) {
    let node = nodes[0];
    let currentNode = new Node(node.row + row, node.column + column);

    let data, startRowData = addNewDataObjectWithPiece(header, currentNode, piece);
    let previousData = startRowData;

    for (let n = 1; n < nodes.length; n++) {
        node = nodes[n];
        currentNode = new Node(node.row + row, node.column + column);
        data = addNewDataObjectWithPiece(header, currentNode, piece, previousData);
        previousData.right = data;
        previousData = data;
    }

    startRowData.left = data;
    data.right = startRowData;
}

function addNewDataObjectWithPiece(header, currentNode, piece, previousData) {
    const current = findColumnForNode(header, currentNode);
    if (current === undefined) {
        return;
    }

    const data = new PieceDataObject({piece, column: current, down: current, up: current.up, left: previousData});

    data.up.down = data;
    data.down.up = data;
    current.size++;

    return data;
}

function countDLXsolutions(header, k) {
    if (header.right == header) {
        return 1;
    }
    else {
        let numberOfSolutions = 0;
        let current = chooseColumn(header);
        coverColumn(current);
        let row = current.down;

        while (row != current) {
            if(row.piece.numberOfUsages > 0) {
                row.piece.numberOfUsages--;
                let j = row.right;
                while (j != row) {
                    coverColumn(j.column);
                    j = j.right;
                }
                numberOfSolutions += countDLXsolutions(header, k + 1);

                current = row.column;
                j = row.left;
                while (j != row) {
                    uncoverColumn(j.column);
                    j = j.left;
                }
                row.piece.numberOfUsages++;
            }
            row = row.down;
        }

        uncoverColumn(current);
        return numberOfSolutions;
    }
}

function searchDLXWithPiece(header, solution, k) {
    if (header.right === header) {
        return true;
    }
    else {
        let isSolutionFound = false;
        let current = chooseColumn(header);
        coverColumn(current);
        let row = current.down;

        while (row !== current && !isSolutionFound) {
            if(row.piece.numberOfUsages > 0) {
                solution[k] = row;
                row.piece.numberOfUsages--;

                let j = row.right;
                while (j !== row) {
                    coverColumn(j.column);
                    j = j.right;
                }
                isSolutionFound = searchDLXWithPiece(header, solution, k + 1);
                row = solution[k];
                row.piece.numberOfUsages++;
                current = row.column;
                j = row.left;
                while (j !== row) {
                    uncoverColumn(j.column);
                    j = j.left;
                }
            }

            row = row.down;
        }

        uncoverColumn(current);
        return isSolutionFound;
    }
}

export {
    createXListForExactCoverProblem, searchDLX, printDLX,
    createXListForExactCoverProblemWithPiece, countDLXsolutions, searchDLXWithPiece
};