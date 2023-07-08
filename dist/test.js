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
import { Utils } from "./utils.js";
class Test {
    static run(depth, start = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (depth == 0)
                return 1;
            const moves = yield board.getValidMovesFromColor(board.turn);
            let numPositions = 0;
            for (const move of moves) {
                yield new Promise((resolve) => setTimeout(resolve, 0));
                board.makeMove(move);
                board.turn = !board.turn;
                const result = yield this.run(depth - 1, false);
                numPositions += result;
                board.unmakeMove(move);
                board.turn = !board.turn;
                if (start) {
                    const expected = this.expectedMoves[depth][Utils.moveToStr(move)];
                    console.log("%c" + Utils.moveToStr(move) + " " + result + " | " + expected, "color: " + (result == expected ? "green" : "red"));
                    if (result != expected)
                        throw new Error("Test failed");
                }
            }
            return numPositions;
        });
    }
}
Test.expected = [];
Test.expectedMoves = [
    {
        a2a3: 0,
        b2b3: 0,
        c2c3: 0,
        d2d3: 0,
        e2e3: 0,
        f2f3: 0,
        g2g3: 0,
        h2h3: 0,
        a2a4: 0,
        b2b4: 0,
        c2c4: 0,
        d2d4: 0,
        e2e4: 0,
        f2f4: 0,
        g2g4: 0,
        h2h4: 0,
        b1a3: 0,
        b1c3: 0,
        g1f3: 0,
        g1h3: 0
    },
    {
        a2a3: 1,
        b2b3: 1,
        c2c3: 1,
        d2d3: 1,
        e2e3: 1,
        f2f3: 1,
        g2g3: 1,
        h2h3: 1,
        a2a4: 1,
        b2b4: 1,
        c2c4: 1,
        d2d4: 1,
        e2e4: 1,
        f2f4: 1,
        g2g4: 1,
        h2h4: 1,
        b1a3: 1,
        b1c3: 1,
        g1f3: 1,
        g1h3: 1
    },
    {
        a2a3: 20,
        b2b3: 20,
        c2c3: 20,
        d2d3: 20,
        e2e3: 20,
        f2f3: 20,
        g2g3: 20,
        h2h3: 20,
        a2a4: 20,
        b2b4: 20,
        c2c4: 20,
        d2d4: 20,
        e2e4: 20,
        f2f4: 20,
        g2g4: 20,
        h2h4: 20,
        b1a3: 20,
        b1c3: 20,
        g1f3: 20,
        g1h3: 20
    },
    {
        a2a3: 380,
        b2b3: 420,
        c2c3: 420,
        d2d3: 539,
        e2e3: 599,
        f2f3: 380,
        g2g3: 420,
        h2h3: 380,
        a2a4: 420,
        b2b4: 421,
        c2c4: 441,
        d2d4: 560,
        e2e4: 600,
        f2f4: 401,
        g2g4: 421,
        h2h4: 420,
        b1a3: 400,
        b1c3: 440,
        g1f3: 440,
        g1h3: 400
    }
];
export { Test };
