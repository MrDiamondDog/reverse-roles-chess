import {PieceType, board, currentPieceImageType} from "./main.js";
import {Move} from "./move.js";
import {Square} from "./square.js";
import {Utils} from "./utils.js";

export class Piece {
    public element: HTMLDivElement;
    public square: Square;
    public type: PieceType;
    public isDark: boolean;
    public lastMove: number = 0;
    public hasMoved: boolean = false;

    constructor(square: Square, type: PieceType, isDark: boolean) {
        this.square = square;
        this.type = type;
        this.isDark = isDark;

        this.element = document.createElement("div");
        this.element.classList.add("piece");
        this.element.classList.add(Utils.getPieceStr(type));
        this.element.classList.add(isDark ? "light" : "dark");

        const image = document.createElement("img");
        image.src = `./img/${currentPieceImageType}/${isDark ? "w" : "b"}${Utils.getPieceChar(
            type
        )}.svg`;
        image.classList.add("piece-img");
        this.element.appendChild(image);
    }

    public async getMoves(includeCastling: boolean): Promise<Move[]> {
        if (this.type == PieceType.Pawn) {
            return this.getPawnMoves();
        } else if (this.type == PieceType.Knight) {
            return this.getKnightMoves();
        } else if (this.type == PieceType.Bishop) {
            return this.getBishopMoves();
        } else if (this.type == PieceType.Rook) {
            return this.getRookMoves();
        } else if (this.type == PieceType.Queen) {
            return this.getQueenMoves();
        } else if (this.type == PieceType.King) {
            const moves = await this.getKingMoves();
            if (includeCastling) {
                const castlingMoves = await this.getCastlingMoves();
                return moves.concat(castlingMoves);
            }
            return moves;
        }
        return [];
    }

    public getPawnMoves(): Move[] {
        // two forward on 2nd row from bottom, one forward otherwise

        // forward
        let moves: Move[] = [];
        let forward = this.isDark ? -1 : 1;
        let square = this.square.board.getSquare(this.square.x, this.square.y + forward);
        if (square && !square.piece) {
            moves.push(new Move(this.square, square));
        }

        // two forward
        if (this.square.y == (this.isDark ? 6 : 1)) {
            square = this.square.board.getSquare(this.square.x, this.square.y + forward * 2);
            if (square && !square.piece) {
                moves.push(new Move(this.square, square));
            }
        }

        // capture
        square = this.square.board.getSquare(this.square.x - 1, this.square.y + forward);
        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 1, this.square.y + forward);
        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        // en passant
        if (this.square.y == (this.isDark ? 4 : 3)) {
            square = this.square.board.getSquare(this.square.x - 1, this.square.y);
            if (
                square &&
                square.piece &&
                square.piece.isDark != this.isDark &&
                square.piece.lastMove == 0
            ) {
                square = this.square.board.getSquare(this.square.x - 1, this.square.y + forward);
                if (square && !square.piece) {
                    moves.push(new Move(this.square, square, true));
                }
            }

            square = this.square.board.getSquare(this.square.x + 1, this.square.y);
            if (
                square &&
                square.piece &&
                square.piece.isDark != this.isDark &&
                square.piece.lastMove == 0
            ) {
                square = this.square.board.getSquare(this.square.x + 1, this.square.y + forward);
                if (square && !square.piece) {
                    moves.push(new Move(this.square, square, true));
                }
            }
        }

        for (let i = 0; i < moves.length; i++) {
            if (moves[i].to.y == (this.isDark ? 0 : 7)) {
                moves[i].promote = true;
            }
        }

        return moves;
    }

    public getKnightMoves(): Move[] {
        let moves: Move[] = [];

        let square = this.square.board.getSquare(this.square.x - 1, this.square.y - 2);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 1, this.square.y - 2);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 2, this.square.y - 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 2, this.square.y - 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 2, this.square.y + 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 2, this.square.y + 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 1, this.square.y + 2);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 1, this.square.y + 2);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        return moves;
    }

    public getBishopMoves(): Move[] {
        // diagonal

        let moves: Move[] = [];

        let square = this.square.board.getSquare(this.square.x + 1, this.square.y + 1);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x + 1, square.y + 1);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 1, this.square.y + 1);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x - 1, square.y + 1);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 1, this.square.y - 1);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x + 1, square.y - 1);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 1, this.square.y - 1);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x - 1, square.y - 1);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        return moves;
    }

    public getRookMoves(): Move[] {
        // horizontal/vertical

        let moves: Move[] = [];

        let square = this.square.board.getSquare(this.square.x + 1, this.square.y);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x + 1, square.y);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 1, this.square.y);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x - 1, square.y);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x, this.square.y + 1);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x, square.y + 1);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x, this.square.y - 1);
        while (square && !square.piece) {
            moves.push(new Move(this.square, square));
            square = this.square.board.getSquare(square.x, square.y - 1);
        }

        if (square && square.piece && square.piece.isDark != this.isDark) {
            moves.push(new Move(this.square, square));
        }

        return moves;
    }

    public getQueenMoves(): Move[] {
        return this.getRookMoves().concat(this.getBishopMoves());
    }

    public async getKingMoves(): Promise<Move[]> {
        // one square in every direction
        let moves: Move[] = [];

        let square = this.square.board.getSquare(this.square.x + 1, this.square.y);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 1, this.square.y);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x, this.square.y + 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x, this.square.y - 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 1, this.square.y + 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x + 1, this.square.y - 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 1, this.square.y + 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        square = this.square.board.getSquare(this.square.x - 1, this.square.y - 1);
        if (square && (!square.piece || square.piece.isDark != this.isDark)) {
            moves.push(new Move(this.square, square));
        }

        return moves;
    }

    public async getCastlingMoves(): Promise<Move[]> {
        let moves: Move[] = [];

        if (!this.hasMoved) {
            // king side
            let rook = this.square.board.getSquare(7, this.square.y)?.piece;
            if (rook && rook.type == PieceType.Rook && !rook.hasMoved) {
                let square = this.square.board.getSquare(6, this.square.y);
                let square2 = this.square.board.getSquare(5, this.square.y);
                if (square && !square.piece && square2 && !square2.piece) {
                    if (
                        !(await board.isSquareInCheck(square, !this.isDark)) &&
                        !(await board.isSquareInCheck(square2, !this.isDark))
                    ) {
                        moves.push(new Move(this.square, square, false, rook.square));
                    }
                }
            }

            // queen side
            rook = this.square.board.getSquare(0, this.square.y)?.piece;
            if (rook && rook.type == PieceType.Rook && !rook.hasMoved) {
                let square = this.square.board.getSquare(2, this.square.y);
                let square2 = this.square.board.getSquare(3, this.square.y);
                let square3 = this.square.board.getSquare(1, this.square.y);
                if (
                    square &&
                    !square.piece &&
                    square2 &&
                    !square2.piece &&
                    square3 &&
                    !square3.piece
                ) {
                    if (
                        !(await board.isSquareInCheck(square, !this.isDark)) &&
                        !(await board.isSquareInCheck(square2, !this.isDark))
                    ) {
                        moves.push(new Move(this.square, square, false, rook.square));
                    }
                }
            }
        }

        return moves;
    }
}
