import { PieceType, board } from "./main.js";
import { Move } from "./move.js";
export class Utils {
    static getPieceFromStr(piece) {
        let type = PieceType.Pawn;
        switch (piece.toLowerCase()) {
            case "pawn":
                type = PieceType.Pawn;
                break;
            case "knight":
                type = PieceType.Knight;
                break;
            case "bishop":
                type = PieceType.Bishop;
                break;
            case "rook":
                type = PieceType.Rook;
                break;
            case "queen":
                type = PieceType.Queen;
                break;
            case "king":
                type = PieceType.King;
                break;
        }
        return type;
    }
    static getPieceFromChar(char) {
        let type = PieceType.Pawn;
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
        return type;
    }
    static getPieceStr(piece) {
        switch (piece) {
            case PieceType.Pawn:
                return "pawn";
            case PieceType.Knight:
                return "knight";
            case PieceType.Bishop:
                return "bishop";
            case PieceType.Rook:
                return "rook";
            case PieceType.Queen:
                return "queen";
            case PieceType.King:
                return "king";
        }
    }
    static getPieceChar(piece) {
        switch (piece) {
            case PieceType.Pawn:
                return "P";
            case PieceType.Knight:
                return "N";
            case PieceType.Bishop:
                return "B";
            case PieceType.Rook:
                return "R";
            case PieceType.Queen:
                return "Q";
            case PieceType.King:
                return "K";
        }
    }
    static getSquareStr(square) {
        return String.fromCharCode(97 + square.x) + (8 - square.y);
    }
    static moveToStr(move) {
        return Utils.getSquareStr(move.from) + Utils.getSquareStr(move.to);
    }
    static getMoveFromStr(move) {
        let fromX = move.charCodeAt(0) - 97;
        let fromY = 8 - parseInt(move[1]);
        let toX = move.charCodeAt(2) - 97;
        let toY = 8 - parseInt(move[3]);
        let promoteTo = move.length > 4 ? Utils.getPieceFromChar(move.substring(4)) : PieceType.Pawn;
        return new Move(board.getSquare(fromX, fromY), board.getSquare(toX, toY), false, null, promoteTo != PieceType.Pawn, promoteTo);
    }
}
