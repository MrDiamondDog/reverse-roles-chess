import {PieceType} from "./main.js";
import {Move} from "./move.js";
import {Square} from "./square.js";

export class Utils {
    public static getPieceStr(piece: PieceType) {
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

    public static getPieceChar(piece: PieceType) {
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

    public static getSquareStr(square: Square) {
        return String.fromCharCode(97 + square.x) + (8 - square.y);
    }

    public static moveToStr(move: Move) {
        return Utils.getSquareStr(move.from) + Utils.getSquareStr(move.to);
    }
}
