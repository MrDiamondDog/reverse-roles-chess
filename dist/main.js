import { Board } from "./board.js";
export const board = new Board();
export var PieceType;
(function (PieceType) {
    PieceType[PieceType["Pawn"] = 0] = "Pawn";
    PieceType[PieceType["Knight"] = 1] = "Knight";
    PieceType[PieceType["Bishop"] = 2] = "Bishop";
    PieceType[PieceType["Rook"] = 3] = "Rook";
    PieceType[PieceType["Queen"] = 4] = "Queen";
    PieceType[PieceType["King"] = 5] = "King";
})(PieceType || (PieceType = {}));
export var PieceImageType;
(function (PieceImageType) {
    PieceImageType["Pixel"] = "Pixel";
    PieceImageType["Alpha"] = "Alpha";
})(PieceImageType || (PieceImageType = {}));
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
