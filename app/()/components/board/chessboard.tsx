// components/Chessboard.tsx
import React, { useState, useEffect } from 'react';
import Chess from 'chess.js';

const chess = new Chess();

const generateBoard = () => {
  const board: string[][] = [];
  for (let row = 0; row < 8; row++) {
    const rowArr = [];
    for (let col = 0; col < 8; col++) {
      rowArr.push((row + col) % 2 === 0 ? 'white' : 'black');
    }
    board.push(rowArr);
  }
  return board;
};

const Chessboard: React.FC = () => {
  const [board, setBoard] = useState(generateBoard());
  const [game, setGame] = useState(chess.fen());
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'MOVE') {
        chess.load(data.boardState);
        setGame(chess.fen());
      } else if (type === 'MESSAGE') {
        // Handle new message
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleMove = (from: string, to: string) => {
    const move = chess.move({ from, to });
    if (move && ws) {
      ws.send(JSON.stringify({ type: 'MAKE_MOVE', data: { gameId: 1, move: move.san } })); // Use actual game ID
      setGame(chess.fen());
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    // Convert row and col to algebraic notation
    // Example: handleMove('e2', 'e4');
  };

  return (
    <div className="grid grid-cols-8 w-full h-full">
      {board.flat().map((color, index) => (
        <div
          key={index}
          className={`w-full h-full ${color === 'white' ? 'bg-white' : 'bg-gray-800'}`}
          onClick={() => handleSquareClick(Math.floor(index / 8), index % 8)}
        >
          {/* Render chess pieces here */}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
