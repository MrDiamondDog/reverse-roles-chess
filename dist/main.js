import { Board } from "./board.js";
export const stockfish = new Worker("../node_modules/stockfish/src/stockfish.js");
export const board = new Board();
export const difficultyDepths = {
    "0": 3,
    "1": 5,
    "2": 9,
    "3": 12,
    "4": 15,
    "5": 17,
    "6": 20,
    "7": 25 // you dare cheat?
};
export let stockfishDepth = difficultyDepths["0"];
export var PieceType;
(function (PieceType) {
    PieceType["Pawn"] = "pawn";
    PieceType["Knight"] = "knight";
    PieceType["Bishop"] = "bishop";
    PieceType["Rook"] = "rook";
    PieceType["Queen"] = "queen";
    PieceType["King"] = "king";
})(PieceType || (PieceType = {}));
export var PieceImageType;
(function (PieceImageType) {
    PieceImageType["Pixel"] = "Pixel";
    PieceImageType["Alpha"] = "Alpha";
    PieceImageType["Shapes"] = "Shapes";
    PieceImageType["Disguised"] = "Disguised";
})(PieceImageType || (PieceImageType = {}));
const pieceImageSelect = document.getElementById("piece-set");
const piecePreview = document.getElementById("piece-prev");
pieceImageSelect.addEventListener("change", () => {
    const value = pieceImageSelect.value;
    currentPieceImageType = value;
    const previewPieces = piecePreview.querySelectorAll("img");
    previewPieces.forEach((piece) => {
        piece.src = `./img/${value}/${piece.dataset.piece}.svg`;
    });
    for (const square of board.squares.flat()) {
        if (square.piece) {
            square.piece.updateSrc();
        }
    }
});
export let currentPieceImageType = PieceImageType.Pixel;
board.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
const startMenu = document.getElementById("start");
const diffSelect = document.getElementById("difficulty");
const diffButtons = diffSelect.querySelectorAll("button");
diffButtons.forEach((button) => {
    button.onclick = () => {
        diffButtons.forEach((button) => {
            button.classList.remove("selected");
        });
        button.classList.add("selected");
        stockfishDepth =
            difficultyDepths[button.dataset.difficulty];
    };
});
const startButton = startMenu.querySelector("#start-button");
startButton.onclick = () => {
    if (stockfishDepth == difficultyDepths["7"])
        return;
    startMenu.style.display = "none";
};
// const expected = [1, 20, 400, 8902, 197281, 4865609, 119060324];
// async function runTest(depth: number) {
//     const result = await Test.run(depth);
//     console.log(
//         "%cgot: " + result + " expected: " + expected[depth] + " depth: " + depth,
//         "color: " + (result == expected[depth] ? "green" : "red")
//     );
//     await new Promise((resolve) => setTimeout(resolve, 1000));
// }
// const input = document.getElementById("depth") as HTMLInputElement;
// const button = document.getElementById("start") as HTMLButtonElement;
// if (button) {
//     button.onclick = () => {
//         const depth = parseInt(input.value);
//         runTest(depth);
//     };
// }
