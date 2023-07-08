var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { board } from "./main.js";
export class Test {
    constructor(fen, expectedMoves, turn) {
        this.actualMoves = 0;
        this.fen = fen;
        this.expectedMoves = expectedMoves;
        this.turn = turn;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    board.squares[x][y].setPiece(null);
                }
            }
            board.loadFen(this.fen);
            board.turn = this.turn;
            this.actualMoves = (yield board.getValidMovesFromColor(this.turn)).length;
            if (this.actualMoves != this.expectedMoves) {
                console.log(`%cTest failed: %c${this.fen} %cexpected %c${this.expectedMoves} %cmoves, got %c${this.actualMoves} %cmoves`, "color: red", "color: white", "color: red", "color: white", "color: red", "color: white", "color: red");
            }
            else {
                console.log(`%cTest passed: %c${this.fen}`, "color: green", "color: white");
            }
        });
    }
}
