var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PieceType } from "./main.js";
import { Piece } from "./piece.js";
export class Square {
    constructor(board, x, y) {
        var _a;
        this.piece = null;
        this.listener = null;
        this.board = board;
        this.x = x;
        this.y = y;
        this.element = document.createElement("div");
        this.element.classList.add("square");
        this.element.classList.add((x + y) % 2 == 0 ? "light" : "dark");
        (_a = document.getElementById("board")) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);
        this.element.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () { return yield this.onClick(); }));
    }
    setPiece(piece) {
        this.piece = piece;
        this.element.innerHTML = "";
        if (this.piece) {
            this.piece.square = this;
            this.element.appendChild(this.piece.element);
        }
    }
    pieceFromChar(char) {
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
    onClick() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.board.selectSquare(this);
        });
    }
}
