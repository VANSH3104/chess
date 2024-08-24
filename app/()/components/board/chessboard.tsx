"use client";
import React, { useState } from 'react';
interface Square {
  id: string;
  isDark: boolean;
  piece?: string; // You can store a piece or any other data here
}

export const ChessBoard: React.FC = () => {
  const [squares, setSquares] = useState<Square[]>([]);
  const alphabate = ['a', 'b', 'c', 'd', 'e', 'f', 'g' , 'h']
  // Initialize the board when the component mounts
  React.useEffect(() => {
    const initialSquares: Square[] = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const isDark = (i + j) % 2 === 0;
        initialSquares.push({ id: `${alphabate[j]}${8-i}`, isDark });
      }
    }
    setSquares(initialSquares);
  }, []);
  const handleSquareClick = (id: string) => {
    console.log(`Square ${id} clicked!`);
    setSquares(prevSquares =>
      prevSquares.map(square =>
        square.id === id ? { ...square, piece: square.piece ? undefined : 'P' } : square
      )
    );
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full lg:w-[80%] h-full">
      {squares.map(square => (
        <div
          key={square.id}
          onClick={() => handleSquareClick(square.id)}
          className={`w-full h-full flex justify-center items-center cursor-pointer ${
            square.isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          {<img src='../../../../public/images/wp.png' />}
        </div>
      ))}
    </div>
  );
};
