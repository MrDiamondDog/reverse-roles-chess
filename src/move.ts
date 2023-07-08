import {Piece} from "./piece.js";
import {Square} from "./square.js";

export class Move {
    public from: Square;
    public to: Square;
    public fromPiece: Piece;
    public toPiece: Piece | null = null;
    public id: string = "";
    public isEnPassasnt: boolean = false;
    public castleRook: Square | null = null;

    constructor(
        from: Square,
        to: Square,
        isEnPassasnt: boolean = false,
        castleRook: Square | null = null
    ) {
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
