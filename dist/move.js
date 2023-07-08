import { PieceType } from "./main.js";
export class Move {
    constructor(from, to, isEnPassasnt = false, castleRook = null, promote = false, promoteTo = PieceType.Pawn) {
        this.toPiece = null;
        this.id = "";
        this.isEnPassasnt = false;
        this.castleRook = null;
        this.promote = false;
        this.promoteTo = PieceType.Pawn;
        this.from = from;
        this.to = to;
        if (from.piece == null) {
            throw new Error("from.piece is null");
        }
        this.fromPiece = from.piece;
        this.toPiece = to.piece;
        this.isEnPassasnt = isEnPassasnt;
        this.castleRook = castleRook;
        this.promote = promote;
        this.promoteTo = promoteTo;
    }
}
