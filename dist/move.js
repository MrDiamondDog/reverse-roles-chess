export class Move {
    constructor(from, to, isEnPassasnt = false, castleRook = null) {
        this.toPiece = null;
        this.id = "";
        this.isEnPassasnt = false;
        this.castleRook = null;
        this.from = from;
        this.to = to;
        if (from.piece == null) {
            throw new Error("from.piece is null");
        }
        this.fromPiece = from.piece;
        this.toPiece = to.piece;
        this.isEnPassasnt = isEnPassasnt;
        this.castleRook = castleRook;
    }
}
