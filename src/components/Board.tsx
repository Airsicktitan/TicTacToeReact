import { useEffect, useState } from "react";
import Confetti from 'react-confetti';

export default function Board() {
    const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null)); // Initializes an array of 9 with null values
    const [xIsNext, setXIsNext] = useState(true); // Checks which turn it is 'X' or 'O'
    const [showConfetti, setShowConfetti] = useState(false); // Shows confetti if a winner is declared

    const winner: string| null = calculateWinner(squares); // calls the calculateWinner function that returns the winner
    const isDraw: boolean = !winner && squares.every((square: string | null): square is string => square != null); // Checks if there is no winner and if all squares are filled out
    let status: string; // empty string to set as either winner, draw, or next player

    // Sets the status for display
    if (winner) status = `Winner: ${winner}'s!`;
    else if (isDraw) status = 'Draw!'
    else status = `Next player: ${xIsNext ? "X" : "O"}`;

    // Sets the confetti to appear if a winner is found
    useEffect((): (() => void) | undefined => {
        if (winner) {
            setShowConfetti(true);
            const timer: ReturnType<typeof setTimeout> = setTimeout((): void  => {
                setShowConfetti(false);
            }, 4400); // Confetti disappears after 4.8 seconds
            return (): void  => clearTimeout(timer); // Clean up the timer on component unmount
        }
    }, [winner]);

    // Checks if a square is filled out, if a square is empty set either 'X' or 'O' depending on xIsNext status
    function handleClick(i: number): void {
        if (squares[i] || calculateWinner(squares)) return; // If all squares are filled out and there is a winner do nothing

        const nextSquares: (string | null)[] = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';

        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={(): void  => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={(): void  => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={(): void  => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={(): void  => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={(): void  => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={(): void  => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={(): void  => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={(): void  => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={(): void  => handleClick(8)} />
            </div>
            <div>
                {(winner || isDraw) && (
                    <>
                        {showConfetti && <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}/>}
                        <button
                            className="button"
                            onClick={(): void => setSquares(Array(9).fill(null))}>Play Again</button>
                    </>
                )}
            </div>
        </>
    );
}

function Square({ value, onSquareClick }: { value: string | null, onSquareClick: () => void }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function calculateWinner(squares: Array<string | null>): string | null {
    const lines: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i: number = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return squares[a];

    }
    return null;
}
