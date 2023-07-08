import {Board} from "./board.js";

export const board = new Board();

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
    Alpha = "Alpha"
}

export let currentPieceImageType = PieceImageType.Pixel;

board.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");

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
