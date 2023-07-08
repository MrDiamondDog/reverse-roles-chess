import { PieceType } from "./main.js";
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
}
