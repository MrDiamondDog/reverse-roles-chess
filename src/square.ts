import {Board} from "./board.js";
import {PieceType} from "./main.js";
import {Piece} from "./piece.js";

export class Square {
    public x: number;
    public y: number;
    public element: HTMLDivElement;
    public piece: Piece | null = null;
    public board: Board;
    public listener: (() => void) | null = null;

    constructor(board: Board, x: number, y: number) {
        this.board = board;
        this.x = x;
        this.y = y;

        this.element = document.createElement("div");
        this.element.classList.add("square");
        this.element.classList.add((x + y) % 2 == 0 ? "light" : "dark");
        document.getElementById("board")?.appendChild(this.element);

        this.element.addEventListener("click", async () => await this.onClick());
    }

    public setPiece(piece: Piece | null) {
        this.piece = piece;
        this.element.innerHTML = "";
        if (this.piece) {
            this.piece.square = this;
            this.element.appendChild(this.piece.element);
        }
    }

    public pieceFromChar(char: string) {
        let type = PieceType.Pawn;
        let isDark = false;
        switch (char.toLowerCase()) {
            case "p":
                type = PieceType.Pawn;
                break;
            case "n":
                type = PieceType.Knight;
                break;
            case "b":
                type = PieceType.Bishop;
                break;
            case "r":
                type = PieceType.Rook;
                break;
            case "q":
                type = PieceType.Queen;
                break;
            case "k":
                type = PieceType.King;
                break;
        }
        isDark = char.toLowerCase() != char;
        return new Piece(this, type, isDark);
    }

    public async onClick() {
        await this.board.selectSquare(this);
    }
}
