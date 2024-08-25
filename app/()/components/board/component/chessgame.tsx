"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Chessboard from 'chessboardjsx';
import * as engine from '../utils/engine';
import BotSelector from './bot';
import History from './history';
import type { AvailableBots, InitialisedBot } from '../utils/bots';

type SelectedBot = {
  name: string;
  move: InitialisedBot;
} | null;

type BoardMove = {
  sourceSquare: engine.Square;
  targetSquare: engine.Square;
};

const ChessGame: React.FC<{
  bots: AvailableBots;
  onGameCompleted: (winner: engine.GameWinner) => void;
}> = ({ bots, onGameCompleted }) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [fen, setFen] = useState<engine.Fen>(engine.newGame());
  const [history, setHistory] = useState<Array<engine.Move>>([]);
  const [whiteBot, setWhiteBot] = useState<SelectedBot>(null);
  const [blackBot, setBlackBot] = useState<SelectedBot>(null);

  const newGame = () => {
    setPlaying(false);
    setFen(engine.newGame());
    setHistory([]);
  };

  const doMove = useCallback(
    (currentFen: engine.Fen, from: engine.Square, to: engine.Square) => {
      try {
        const move = engine.move(currentFen, from, to);
  
        if (!move) {
          // If the move is invalid, just return the current FEN without making any changes
          return currentFen;
        }
  
        const [newFen, action] = move;
  
        if (engine.isGameOver(newFen)) {
          onGameCompleted(engine.getGameWinner(newFen));
          newGame();
          return newFen;
        }
  
        // If the move is valid, update the state
        setFen(newFen);
        setHistory(prevHistory => [...prevHistory, action]);
        return newFen;
  
      } catch (error) {
        console.error("Invalid move:", error);
        return currentFen;
      }
    },
    [onGameCompleted]
  );
  

  const onDragStart = ({ sourceSquare: from }: Pick<BoardMove, 'sourceSquare'>) => {
    const isWhiteBotTurn = whiteBot && engine.isWhiteTurn(fen);
    const isBlackBotTurn = blackBot && engine.isBlackTurn(fen);

    // Prevent piece drag if it's not the player's turn
    return isPlaying && engine.isMoveable(fen, from) && !(isWhiteBotTurn || isBlackBotTurn);
  };

  const onMovePiece = ({ sourceSquare: from, targetSquare: to }: BoardMove) => {
   const newFen= doMove(fen, from, to);
   return newFen
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isBotMovePlayable = true;

    const botMove = async (bot: SelectedBot | null) => {
      if (bot) {
        const move = await bot.move(fen);
        if (isBotMovePlayable) {
          doMove(fen, move.from, move.to);
        }
      }
    };

    if (engine.isWhiteTurn(fen)) {
      botMove(whiteBot);
    } else if (engine.isBlackTurn(fen)) {
      botMove(blackBot);
    }

    return () => {
      isBotMovePlayable = false;
    };
  }, [isPlaying, fen, whiteBot, blackBot, doMove]);

  return (
    <div className="min-w-[750px]">
      <div className="text-center">
        <BotSelector
          playerName="White"
          availableBots={bots}
          selectedBot={whiteBot}
          setSelectedBot={setWhiteBot}
          disabled={isPlaying}
        />
        <BotSelector
          playerName="Black"
          availableBots={bots}
          selectedBot={blackBot}
          setSelectedBot={setBlackBot}
          disabled={isPlaying}
        />
        <button className="m-1.5" onClick={() => setPlaying(playing => !playing)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="m-1.5" onClick={newGame}>
          Reset
        </button>
      </div>
      <div className="float-left">
        <Chessboard position={fen} allowDrag={onDragStart} onDrop={onMovePiece} />
      </div>
      <History history={history} />
    </div>
  );
};

export default ChessGame;
