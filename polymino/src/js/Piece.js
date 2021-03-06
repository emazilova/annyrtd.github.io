import {Node} from './Node';

class Piece {
    constructor(coordinates, color = getRandomColor(), numberOfUsages = Infinity) {
        this.color = color;
        let nodes = [];
        let maxrow = coordinates[0][0];
        let minrow = coordinates[0][0];
        let maxcol = coordinates[0][1];
        let mincol = coordinates[0][1];
        for (let i = 0; i < coordinates.length; i++) {
            nodes.push(new Node(coordinates[i][0], coordinates[i][1]));
            if (coordinates[i][0] > maxrow) {
                maxrow = coordinates[i][0];
            }
            if (coordinates[i][1] > maxcol) {
                maxcol = coordinates[i][1];
            }

            if (coordinates[i][0] < minrow) {
                minrow = coordinates[i][0];
            }
            if (coordinates[i][1] < mincol) {
                mincol = coordinates[i][1];
            }
        }

        this.nodes = nodes;
        this.maxrow = maxrow;
        this.minrow = minrow;
        this.maxcol = maxcol;
        this.mincol = mincol;
        this.root = Piece.getPieceRoot(nodes);
        this.numberOfUsages = numberOfUsages;
    }

    getView() {
        if(this.view) {
            return this.view;
        }

        let color = this.color;
        let tbody = document.createElement('tbody');
        let table = document.createElement('table');

        for (let i = this.minrow; i <= this.maxrow; i++) {
            let tr = document.createElement('tr');
            for (let j = this.mincol; j <= this.maxcol; j++) {
                let td = document.createElement('td');
                tr.appendChild(td)
            }
            tbody.appendChild(tr);
        }

        this.nodes.forEach(node => {
            let cell = tbody
                .children[node.row - this.minrow]
                .children[node.column - this.mincol];
            cell.style.backgroundColor = color;
            cell.setAttribute('class', 'pieceCell');
            cell.style.border = '1px solid black';
        });

        table.setAttribute('class', 'piece');
        table.setAttribute('data-nodes', this.nodes.map(item => new Node(item.row - this.minrow, item.column - this.mincol).toString()).join('-'));
        table.appendChild(tbody);

        this.view = table;
        return table;
    }

    static getPieceRoot(nodes) {
        let minimum = nodes[0];

        for (let k = 1; k < nodes.length; k++) {
            if (nodes[k].column < minimum.column) {
                minimum = nodes[k];
            } else if (nodes[k].column == minimum.column) {
                if (nodes[k].row < minimum.row) {
                    minimum = nodes[k];
                }
            }
        }

        return minimum;
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 12 + 2)];
    }
    if (color == '#000000' || color == '#FFFFFF') {
        return '#333333';
    }
    return color;
}

export {Piece};