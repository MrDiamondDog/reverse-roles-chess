import {Board} from "./board.js";
export const stockfish = new Worker("./node_modules/stockfish/src/stockfish.js");

export const board = new Board();

export const difficultyDepths = {
    "0": 3, // little baby
    "1": 5, // big baby
    "2": 9, // eh
    "3": 12, // ok this is hard
    "4": 15, // help
    "5": 17, // SOS
    "6": 20, // :skull:
    "7": 25 // you dare cheat?
};

export let stockfishDepth = difficultyDepths["0"];

export enum PieceType {
    Pawn = "pawn",
    Knight = "knight",
    Bishop = "bishop",
    Rook = "rook",
    Queen = "queen",
    King = "king"
}

export enum PieceImageType {
    Pixel = "Pixel",
    Alpha = "Alpha",
    Shapes = "Shapes",
    Disguised = "Disguised"
}

const pieceImageSelect = document.getElementById("piece-set") as HTMLSelectElement;
const piecePreview = document.getElementById("piece-prev") as HTMLDivElement;
pieceImageSelect.addEventListener("change", () => {
    const value = pieceImageSelect.value as PieceImageType;
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

const startMenu = document.getElementById("start") as HTMLDivElement;
const diffSelect = document.getElementById("difficulty") as HTMLDivElement;

const diffButtons = diffSelect.querySelectorAll("button");
diffButtons.forEach((button) => {
    button.onclick = () => {
        diffButtons.forEach((button) => {
            button.classList.remove("selected");
        });
        button.classList.add("selected");
        stockfishDepth =
            difficultyDepths[button.dataset.difficulty! as keyof typeof difficultyDepths];
    };
});

const startButton = startMenu.querySelector("#start-button") as HTMLButtonElement;
startButton.onclick = () => {
    if (stockfishDepth == difficultyDepths["7"]) return;
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
