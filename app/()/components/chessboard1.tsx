// pages/game.tsx
import { useEffect, useState } from 'react';
import Chessboard from '../components/board/chessboard';
import React from 'react';

const GamePage: React.FC = () => {
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    // Fetch the game state from the API
    const fetchGame = async () => {
      const response = await fetch('/api/game/1'); // Use actual game ID
      const data = await response.json();
      setGame(data);
    };

    fetchGame();
  }, []);

  if (!game) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center h-screen">
      <Chessboard game={game} />
    </div>
  );
};

export default GamePage;
