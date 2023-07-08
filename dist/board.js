var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PieceType, currentPieceImageType, stockfish, stockfishDepth } from "./main.js";
import { Piece } from "./piece.js";
import { Square } from "./square.js";
import { Utils } from "./utils.js";
export class Board {
    constructor() {
        this.selectedPiece = null;
        /**
         * true = white's turn
         * false = black's turn
         */
        this.turn = true;
        this.playerColor = true;
        this.moves = [];
        this.moveCount = 0;
        this.promoting = false;
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
    loadFen(fen) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < fen.length; i++) {
            const char = fen.charAt(i);
            if (char == "/") {
                x = 0;
                y++;
            }
            else if (char >= "1" && char <= "8") {
                x += parseInt(char);
            }
            else {
                let piece = this.squares[x][y].pieceFromChar(char);
                this.squares[x][y].setPiece(piece);
                x++;
            }
        }
        stockfish.postMessage("position fen " + fen);
    }
    selectSquare(square) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.promoting || this.turn != this.playerColor)
                return;
            if (square === null || square === void 0 ? void 0 : square.element.classList.contains("can-move"))
                return;
            if (this.selectedPiece) {
                this.selectedPiece.element.classList.remove("selected");
            }
            this.selectedPiece = square;
            if (this.selectedPiece) {
                this.selectedPiece.element.classList.add("selected");
                if (square != null)
                    yield this.showMoves(square);
            }
        });
    }
    showMoves(square) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.promoting || this.turn != this.playerColor)
                return;
            for (let x = 0; x < this.squares.length; x++) {
                for (let y = 0; y < this.squares[x].length; y++) {
                    const square = this.squares[x][y];
                    square.element.classList.remove("can-move");
                    square.element.removeEventListener("click", square.listener);
                }
            }
            if (square.piece == null)
                return;
            if (square.piece.isDark != this.turn)
                return;
            const moves = yield this.getValidMovesFromSquare(square);
            const uuid = crypto.randomUUID();
            for (let i = 0; i < (moves === null || moves === void 0 ? void 0 : moves.length); i++) {
                const move = moves[i];
                move.id = uuid;
                move.to.element.classList.add("can-move");
                move.to.listener = () => __awaiter(this, void 0, void 0, function* () {
                    if (this.promoting)
                        return;
                    yield this.actuallyMakeMove(move);
                });
                move.to.element.addEventListener("click", move.to.listener, {
                    once: true
                });
            }
        });
    }
    showAllMoves() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let x = 0; x < this.squares.length; x++) {
                for (let y = 0; y < this.squares[x].length; y++) {
                    const square = this.squares[x][y];
                    square.element.classList.remove("can-move");
                    if (square.piece != null)
                        continue;
                }
            }
            const moves = yield this.getValidMoves();
            for (let i = 0; i < (moves === null || moves === void 0 ? void 0 : moves.length); i++) {
                const move = moves[i];
                move.to.element.classList.add("can-move");
            }
        });
    }
    actuallyMakeMove(move, isComputerMove = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (move == null)
                return;
            if (this.moves.includes(move.id))
                return;
            if (move.promote) {
                this.promoting = true;
                const promoteDialog = document.getElementById("promote");
                const promoteButtons = promoteDialog.querySelectorAll("button");
                for (let i = 0; i < promoteButtons.length; i++) {
                    const button = promoteButtons[i];
                    const type = Utils.getPieceFromStr(button.dataset.piece);
                    button.addEventListener("click", () => {
                        move.promoteTo = type;
                        promoteDialog.style.display = "none";
                    }, { once: true });
                    button.innerHTML = `<img src="./img/${currentPieceImageType}/w${Utils.getPieceChar(type)}.svg" alt="${type}"/>`;
                }
                promoteDialog.style.display = "grid";
                yield new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (move.promoteTo != PieceType.Pawn) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
                this.promoting = false;
            }
            const audio = new Audio("./sound/put_down.wav");
            audio.play();
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
                if (rook == null)
                    throw new Error("Rook is null");
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
                    if (square.piece == null)
                        continue;
                    if (square.piece.isDark == ((_a = move.to.piece) === null || _a === void 0 ? void 0 : _a.isDark))
                        continue;
                    square.piece.lastMove++;
                }
            }
            if (move.to.piece != null) {
                move.to.piece.lastMove = 0;
                move.to.piece.hasMoved = true;
            }
            const checkmate = yield this.isCheckmate(this.turn);
            if (checkmate) {
                const winElem = document.getElementById("win");
                if (winElem == null)
                    return;
                const winText = winElem.querySelector("h1");
                if (winText == null)
                    return;
                if (yield this.isInCheck(this.turn)) {
                    winText.innerText = "You " + (this.turn == this.playerColor ? "Lose" : "Win") + "!";
                }
                else {
                    winText.innerText = "Draw!";
                }
                winElem.style.display = "block";
                const restart = document.getElementById("restart");
                if (restart == null)
                    return;
                restart.addEventListener("click", () => {
                    location.reload();
                });
                return;
            }
            if (isComputerMove)
                return;
            this.moveCount++;
            console.log(this.moveCount);
            if (this.moveCount % 10 == 0) {
                const board = document.querySelector("#board");
                board.style.transform = "scaleY(" + (this.playerColor ? -1 : 1) + ")";
                setTimeout(() => {
                    const squares = document.querySelectorAll(".square");
                    squares.forEach((square) => {
                        square.style.transform = "scaleY(" + (this.playerColor ? 1 : -1) + ")";
                    });
                }, 500);
                this.playerColor = !this.playerColor;
            }
            if (this.turn != this.playerColor) {
                console.log("stockfish move");
                const fen = this.getFen();
                console.log(fen);
                stockfish.postMessage("position fen " + fen);
                stockfish.postMessage("isready");
                let isReady = false;
                stockfish.onmessage = (event) => {
                    const message = event.data;
                    if (message == "readyok") {
                        isReady = true;
                    }
                };
                yield new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (isReady) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
                stockfish.postMessage("go depth " + stockfishDepth);
                stockfish.onmessage = (event) => {
                    const message = event.data;
                    if (message.startsWith("bestmove")) {
                        const moveStr = message.split(" ")[1];
                        console.log(moveStr);
                        const move = Utils.getMoveFromStr(moveStr);
                        move.id = crypto.randomUUID();
                        this.actuallyMakeMove(move, true);
                    }
                };
            }
        });
    }
    isCheckmate(color) {
        return __awaiter(this, void 0, void 0, function* () {
            const moves = yield this.getValidMovesFromColor(color);
            return moves.length == 0;
        });
    }
    getMoves(includeCastling = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let moves = [];
            for (let i = 0; i < this.squares.length; i++) {
                for (let j = 0; j < this.squares[i].length; j++) {
                    const square = this.squares[i][j];
                    if (square.piece == null)
                        continue;
                    moves = moves.concat(yield square.piece.getMoves(includeCastling));
                }
            }
            return moves;
        });
    }
    getMovesFromSquare(square, includeCastling = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (square.piece == null)
                return [];
            return yield square.piece.getMoves(includeCastling);
        });
    }
    getMovesFromColor(color, includeCastling = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let moves = [];
            for (let i = 0; i < this.squares.length; i++) {
                for (let j = 0; j < this.squares[i].length; j++) {
                    const square = this.squares[i][j];
                    if (square.piece == null)
                        continue;
                    if (square.piece.isDark != color)
                        continue;
                    moves = moves.concat(yield square.piece.getMoves(includeCastling));
                }
            }
            return moves;
        });
    }
    getValidMoves(includeCastling = true) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const moves = yield this.getMoves(includeCastling);
            const validMoves = [];
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i];
                if (move.castleRook != null && (yield this.isInCheck(this.turn)))
                    continue;
                this.makeMove(move);
                if (!(yield this.isInCheck(this.turn)))
                    validMoves.push(move);
                this.unmakeMove(move);
            }
            resolve(validMoves);
        }));
    }
    getValidMovesFromColor(color) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let moves = yield this.getValidMoves();
            moves = moves.filter((move) => { var _a; return ((_a = move.from.piece) === null || _a === void 0 ? void 0 : _a.isDark) == color; });
            resolve(moves);
        }));
    }
    getValidMovesFromSquare(square) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let moves = yield this.getValidMoves();
            moves = moves.filter((move) => move.from == square);
            resolve(moves);
        }));
    }
    /**
     * @param color true = white, false = black
     */
    isInCheck(color) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const king = this.getKing(color);
            if (king == null)
                return false;
            const moves = yield this.getMoves();
            for (let i = 0; i < moves.length; i++) {
                if (((_a = moves[i].to.piece) === null || _a === void 0 ? void 0 : _a.type) == PieceType.King && ((_b = moves[i].to.piece) === null || _b === void 0 ? void 0 : _b.isDark) == color)
                    return true;
            }
            return false;
        });
    }
    isSquareInCheck(square, color) {
        return __awaiter(this, void 0, void 0, function* () {
            const moves = yield this.getMovesFromColor(color, false);
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].to == square)
                    return true;
            }
            return false;
        });
    }
    makeMove(move) {
        const from = move.from;
        const to = move.to;
        if (from.piece == null)
            return;
        if (from.piece.isDark != this.turn)
            return;
        if (to.piece != null && to.piece.isDark == this.turn)
            return;
        if (move.promote) {
            to.setPiece(new Piece(move.to, move.promoteTo, move.fromPiece.isDark));
        }
        else {
            to.setPiece(from.piece);
        }
        from.setPiece(null);
    }
    unmakeMove(move) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = move.from;
            const to = move.to;
            from.setPiece(move.fromPiece);
            to.setPiece(move.toPiece);
        });
    }
    getSquare(x, y) {
        if (x < 0 || x >= this.squares.length)
            return null;
        if (y < 0 || y >= this.squares[x].length)
            return null;
        return this.squares[x][y];
    }
    getKing(color) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const square = this.squares[x][y];
                if (square.piece == null)
                    continue;
                if (square.piece.type == PieceType.King && square.piece.isDark == color)
                    return square;
            }
        }
        return null;
    }
    getFen() {
        let fen = "";
        for (let y = 0; y < 8; y++) {
            let empty = 0;
            for (let x = 0; x < 8; x++) {
                const square = this.getSquare(x, y);
                if (square == null)
                    continue;
                if (square.piece == null) {
                    empty++;
                }
                else {
                    if (empty > 0) {
                        fen += empty.toString();
                        empty = 0;
                    }
                    const char = Utils.getPieceChar(square.piece.type);
                    fen += !square.piece.isDark ? char.toLowerCase() : char;
                }
            }
            if (empty > 0)
                fen += empty.toString();
            if (y < 7)
                fen += "/";
        }
        fen += " " + (this.turn ? "w" : "b");
        return fen;
    }
}
