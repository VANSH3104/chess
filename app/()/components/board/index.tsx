"use client"
import { NextPage } from 'next';
import ChessboardComponent from './component/chessgame';
import type { AvailableBots } from './utils/bots';
import bots from './utils/bots';

const ChessBoard =() => {
  const handleGameCompletion = () => {
    alert(`Game over! Winner:`);
  };

  return (
    <div className="container mx-auto p-4">
      <ChessboardComponent
        bots={bots}
        onGameCompleted={handleGameCompletion}
      />
    </div>
  );
};

export default ChessBoard;
