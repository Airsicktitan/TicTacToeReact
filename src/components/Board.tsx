import { useEffect, useState } from "react";
import Confetti from 'react-confetti';

export default function Board() {
    const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);

    const winner: string| null = calculateWinner(squares);
    const isDraw: boolean = !winner && squares.every(square => square != null);
    let status;

    if (winner)
        status = `Winner: ${winner}'s!`;
    else if (isDraw)
        status = 'Draw!'
    else
        status = `Next player: ${xIsNext ? "X" : "O"}`;

    useEffect(() => {
        if (winner) {
            setShowConfetti(true);
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 3000); // Confetti disappears after 5 seconds
            return () => clearTimeout(timer); // Clean up the timer on component unmount
        }
    }, [winner]);

    function handleClick(i: number): void {
        if (squares[i] || calculateWinner(squares)) return;

        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';

        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
            <div>
                {(winner || isDraw) && (
                    <>
                        {showConfetti && <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}/>}
                        <button
                            className="button"
                            onClick={() => setSquares(Array(9).fill(null))}>Play Again</button>
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
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
