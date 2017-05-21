import {Piece} from './classes';
Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

const piecesDatabase = [
    // Size 3
    /*new Piece([
        [0, 0], [0, 1], [0, 2]
    ]),
    new Piece([
        [0, 0], [1, 0], [2, 0]
    ]),


    new Piece([
        [0, 0], [0, 1], [1, 0]
    ]),
    new Piece([
        [0, 0], [0, 1], [1, 1]
    ]),
    new Piece([
        [0, 1], [1, 0], [1, 1]
    ]),
    new Piece([
        [0, 0], [1, 0], [1, 1]
    ]),*/

    // Size 4
    new Piece([
        [0, 0], [1, 0], [1, 1], [2, 0]
    ]),
    new Piece([
        [0, 0], [0, 1], [0, 2], [1, 1]
    ]),
    new Piece([
        [0, 1], [1, 0], [1, 1], [1, 2]
    ]),
    new Piece([
        [0, 1], [1, 0], [1, 1], [2, 1]
    ]),


    new Piece([
        [0, 0], [0, 1], [1, 0], [2, 0]
    ]),
    new Piece([
        [0, 0], [0, 1], [0, 2], [1, 2]
    ]),
    new Piece([
        [0, 1], [1, 1], [2, 0], [2, 1]
    ]),
    new Piece([
        [0, 0], [1, 0], [1, 1], [1, 2]
    ]),


    new Piece([
        [0, 1], [0, 2], [1, 0], [1, 1]
    ]),
    new Piece([
        [0, 0], [1, 0], [1, 1], [2, 1]
    ]),
    new Piece([
        [0, 0], [0, 1], [1, 1], [1, 2]
    ]),
    new Piece([
        [0, 1], [1, 0], [1, 1], [2, 0]
    ]),


    new Piece([
        [0, 0], [0, 1], [0, 2], [0, 3]
    ]),
    new Piece([
        [0, 0], [1, 0], [2, 0], [3, 0]
    ]),


    // Size 5
    new Piece([
        [0, 1], [0, 2], [1, 0], [1, 1], [2, 1]
    ]),
    new Piece([
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]
    ]),



    new Piece([
        [0, 0], [1, 0], [2, 0], [3, 0], [3, 1]
    ]),
    new Piece([
        [0, 1], [1, 1], [2, 0], [2, 1], [3, 0]
    ]),



    new Piece([
        [0, 0], [0, 1], [1, 0], [1, 1], [2, 0]
    ]),
    new Piece([
        [0, 0], [0, 1], [0, 2], [1, 1], [2, 1]
    ]),



    new Piece([
        [0, 0], [0, 2], [1, 0], [1, 1], [1, 2]
    ]),
    new Piece([
        [0, 0], [1, 0], [2, 0], [2, 1], [2, 2]
    ]),



    new Piece([
        [0, 0], [1, 0], [1, 1], [2, 1], [2, 2]
    ]),
    new Piece([
        [0, 1], [1, 0], [1, 1], [1, 2], [2, 1]
    ]),



    new Piece([
        [0, 0], [1, 0], [2, 0], [2, 1], [3, 0]
    ]),
    new Piece([
        [0, 0], [0, 1], [1, 1], [2, 1], [2, 2]
    ]),
];
const pieces = [];
const piecesLength = [];

setInitialActivePieces();

function setInitialActivePieces() {
    while(piecesDatabase.length > 0) {
        const piece = piecesDatabase.shift();

        pieces.push(piece);

        const length = piece.nodes.length;
        if(piecesLength.indexOf(length) < 0) {
            piecesLength.push(length);
        }
    }

    console.log('piecesLength:');
    console.log(piecesLength);
}

function activatePiece(piece) {
    const index = piecesDatabase.findIndex(item => item === piece);
    piecesDatabase.splice(index, 1);
    pieces.push(piece);

    const length = piece.nodes.length;
    if(piecesLength.indexOf(length) < 0) {
        piecesLength.push(length);
    }
    console.log('piecesLength:');
    console.log(piecesLength);

}

function deactivatePiece(piece) {
    const index = pieces.findIndex(item => item === piece);
    pieces.splice(index, 1);
    piecesDatabase.push(piece);

    const length = piece.nodes.length;
    if(!pieces.find(pieceInner => length == pieceInner.nodes.length)) {
        piecesLength.remove(length);
    }

    console.log('piecesLength:');
    console.log(piecesLength);
}

export {pieces, activatePiece, deactivatePiece, piecesLength};