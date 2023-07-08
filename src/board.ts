import {PieceType} from "./main.js";
import {Move} from "./move.js";
import {Piece} from "./piece.js";
import {Square} from "./square.js";

export class Board {
    public squares: Square[][];
    public selectedPiece: Square | null = null;
    /**
     * true = white's turn
     * false = black's turn
     */
    public turn: boolean = true;
    public moves: string[] = [];

    constructor() {
        this.squares = [];
        for (let x = 0; x < 8; x++) {
            this.squares[x] = [];
            for (let y = 0; y < 8; y++) {
                this.squares[x][y] = new Square(this, x, y);
            }
        }

        // rotate 90 degrees to the right
        this.squares = this.squares.map((col, i) => this.squares.map((row) => row[i]));
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.squares[x][y].x = x;
                this.squares[x][y].y = y;
            }
        }
    }

    public loadFen(fen: string) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < fen.length; i++) {
            const char = fen.charAt(i);
            if (char == "/") {
                x = 0;
                y++;
            } else if (char >= "1" && char <= "8") {
                x += parseInt(char);
            } else {
                let piece = this.squares[x][y].pieceFromChar(char);
                this.squares[x][y].setPiece(piece);
                x++;
            }
        }
    }

    public async selectSquare(square: Square | null) {
        if (square?.element.classList.contains("can-move")) return;
        if (this.selectedPiece) {
            this.selectedPiece.element.classList.remove("selected");
        }
        this.selectedPiece = square;
        if (this.selectedPiece) {
            this.selectedPiece.element.classList.add("selected");
            if (square != null) await this.showMoves(square);
        }
    }

    public async showMoves(square: Square) {
        for (let x = 0; x < this.squares.length; x++) {
            for (let y = 0; y < this.squares[x].length; y++) {
                const square = this.squares[x][y];
                square.element.classList.remove("can-move");

                square.element.removeEventListener("click", square.listener!);
            }
        }
        if (square.piece == null) return;
        if (square.piece.isDark != this.turn) return;
        const moves = await this.getValidMovesFromSquare(square);
        const uuid = crypto.randomUUID();
        for (let i = 0; i < moves?.length; i++) {
            const move = moves[i];
            move.id = uuid;
            move.to.element.classList.add("can-move");
            move.to.listener = async () => {
                await this.actuallyMakeMove(move);
            };
            move.to.element.addEventListener("click", move.to.listener, {
                once: true
            });
        }
    }

    public async showAllMoves() {
        for (let x = 0; x < this.squares.length; x++) {
            for (let y = 0; y < this.squares[x].length; y++) {
                const square = this.squares[x][y];
                square.element.classList.remove("can-move");
                if (square.piece != null) continue;
            }
        }
        const moves = await this.getValidMoves();
        for (let i = 0; i < moves?.length; i++) {
            const move = moves[i];
            move.to.element.classList.add("can-move");
        }
    }

    public async actuallyMakeMove(move: Move | null) {
        if (move == null) return;
        if (this.moves.includes(move.id)) return;
        this.makeMove(move);
        this.turn = !this.turn;
        this.selectSquare(null);
        this.moves.push(move.id);

        for (let x = 0; x < this.squares.length; x++) {
            for (let y = 0; y < this.squares[x].length; y++) {
                const square = this.squares[x][y];
                square.element.classList.remove("can-move");
            }
        }

        if (move.isEnPassasnt) {
            const enPassantSquare = this.squares[move.to.x][move.from.y];
            enPassantSquare.setPiece(null);
        }

        if (move.castleRook != null) {
            const rook = move.castleRook.piece;
            if (rook == null) throw new Error("Rook is null");
            const rookX = move.castleRook.x;
            const rookY = move.castleRook.y;
            const rookNewX = move.to.x == 2 ? 3 : 5;
            const rookNewY = move.to.y;
            this.squares[rookX][rookY].setPiece(null);
            this.squares[rookNewX][rookNewY].setPiece(rook);
        }

        for (let x = 0; x < this.squares.length; x++) {
            for (let y = 0; y < this.squares[x].length; y++) {
                const square = this.squares[x][y];
                if (square.piece == null) continue;
                if (square.piece.isDark == move.to.piece?.isDark) continue;
                square.piece.lastMove++;
            }
        }
        if (move.to.piece != null) {
            move.to.piece.lastMove = 0;
            move.to.piece.hasMoved = true;
        }

        const checkmate = await this.isCheckmate(this.turn);
        if (checkmate) {
            const checkmateElem = document.getElementById("winner");
            if (checkmateElem == null) return;
            checkmateElem.innerText = "Checkmate! " + (this.turn ? "Black" : "White") + " wins!";
        }
    }

    public async isCheckmate(color: boolean): Promise<boolean> {
        const moves = await this.getValidMovesFromColor(color);
        return moves.length == 0;
    }

    public async getMoves(includeCastling: boolean = true): Promise<Move[]> {
        let moves: Move[] = [];

        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                const square = this.squares[i][j];
                if (square.piece == null) continue;
                moves = moves.concat(await square.piece.getMoves(includeCastling));
            }
        }

        return moves;
    }

    public async getMovesFromSquare(
        square: Square,
        includeCastling: boolean = true
    ): Promise<Move[]> {
        if (square.piece == null) return [];
        return await square.piece.getMoves(includeCastling);
    }

    public async getMovesFromColor(
        color: boolean,
        includeCastling: boolean = true
    ): Promise<Move[]> {
        let moves: Move[] = [];
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                const square = this.squares[i][j];
                if (square.piece == null) continue;
                if (square.piece.isDark != color) continue;
                moves = moves.concat(await square.piece.getMoves(includeCastling));
            }
        }
        return moves;
    }

    public getValidMoves(includeCastling: boolean = true): Promise<Move[]> {
        return new Promise<Move[]>(async (resolve, reject) => {
            const moves = await this.getMoves(includeCastling);
            const validMoves: Move[] = [];
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i];
                if (move.castleRook != null && (await this.isInCheck(this.turn))) continue;
                this.makeMove(move);
                if (!(await this.isInCheck(this.turn))) validMoves.push(move);
                this.unmakeMove(move);
            }
            resolve(validMoves);
        });
    }

    public getValidMovesFromColor(color: boolean): Promise<Move[]> {
        return new Promise<Move[]>(async (resolve, reject) => {
            let moves = await this.getValidMoves();
            moves = moves.filter((move) => move.from.piece?.isDark == color);
            resolve(moves);
        });
    }

    public getValidMovesFromSquare(square: Square): Promise<Move[]> {
        return new Promise<Move[]>(async (resolve, reject) => {
            let moves = await this.getValidMoves();
            moves = moves.filter((move) => move.from == square);
            resolve(moves);
        });
    }

    /**
     * @param color true = white, false = black
     */
    public async isInCheck(color: boolean): Promise<boolean> {
        const king = this.getKing(color);
        if (king == null) return false;
        const moves = await this.getMoves();
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].to.piece?.type == PieceType.King && moves[i].to.piece?.isDark == color)
                return true;
        }
        return false;
    }

    public async isSquareInCheck(square: Square, color: boolean): Promise<boolean> {
        const moves = await this.getMovesFromColor(color, false);
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].to == square) return true;
        }
        return false;
    }

    public makeMove(move: Move) {
        const from = move.from;
        const to = move.to;
        if (from.piece == null) return;
        if (from.piece.isDark != this.turn) return;
        if (to.piece != null && to.piece.isDark == this.turn) return;
        to.setPiece(from.piece);
        from.setPiece(null);
    }

    public async unmakeMove(move: Move) {
        const from = move.from;
        const to = move.to;
        from.setPiece(move.fromPiece);
        to.setPiece(move.toPiece);
    }

    public getSquare(x: number, y: number): Square | null {
        if (x < 0 || x >= this.squares.length) return null;
        if (y < 0 || y >= this.squares[x].length) return null;
        return this.squares[x][y];
    }

    public getKing(color: boolean): Square | null {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const square = this.squares[x][y];
                if (square.piece == null) continue;
                if (square.piece.type == PieceType.King && square.piece.isDark == color)
                    return square;
            }
        }
        return null;
    }
}
