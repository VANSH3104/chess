"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Chessboard from "chessboardjsx";
import * as engine from "../utils/engine";
import BotSelector from "./bot";
import type { AvailableBots, InitialisedBot } from "../utils/bots";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type Checked = DropdownMenuCheckboxItemProps["checked"];
type SelectedBot = {
  name: string;
  move: InitialisedBot;
} | null;

type BoardMove = {
  sourceSquare: engine.Square;
  targetSquare: engine.Square;
};

const ChessGame: React.FC<{
  setHistory: React.Dispatch<React.SetStateAction<engine.Move[]>>;
  bots: AvailableBots;
  onGameCompleted: (winner: engine.GameWinner) => void;
}> = ({ setHistory, bots, onGameCompleted }) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [fen, setFen] = useState<engine.Fen>(engine.newGame());
  const [whiteBot, setWhiteBot] = useState<SelectedBot>(null);
  const [blackBot, setBlackBot] = useState<SelectedBot>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [action, setAction] = useState<"create" | "join">("create");
  const [joinCode, setJoinCode] = useState<string>("");
  const [whiteConnected, setWhiteConnected] = useState<boolean>(false);
  const [blackConnected, setBlackConnected] = useState<boolean>(false);
  const [reverseBoard, setReverseBoard] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(
    null,
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const hasToggled = useRef(false);
  const clickTimeout = useRef(null);
  const [width, setWidth] = useState(250);
  const getOppositeColor = () => {
    if (playerColor === "white") {
      return "black";
    } else {
      return "white";
    }
  };
  const setupWebSocket = () => {
    if (action === "create" || action === "join") {
      const ws = new WebSocket(
        "https://mixed-gwenora-vanshenterprices-0f87ad59.koyeb.app/",
      );

      ws.onopen = () => {
        console.log("WebSocket connection established");
        if (action === "create") {
          ws.send(JSON.stringify({ type: "create", fen }));
        } else if (action === "join" && gameId) {
          ws.send(JSON.stringify({ type: "join", gameId }));
        }
      };

      ws.onmessage = (event) => {
        console.log("Message received:", event.data);
        try {
          const {
            type,
            move,
            fen: newFen,
            gameId: newGameId,
            color: newPlayerColor,
          } = JSON.parse(event.data);
          console.log("data", event.data);
          if (type === "move") {
            setFen(newFen);
            setHistory((prev) => [...prev, move]);
          } else if (type === "joined") {
            alert(`color is ${getOppositeColor()}`);
            setFen(newFen);
            if (playerColor === "white") setWhiteConnected(true);
            if (playerColor === "black") setBlackConnected(true);
          } else if (type === "created") {
            setGameId(newGameId);
            setPlayerColor(newPlayerColor);
            console.log(playerColor, "isnsoid ");
            alert(
              `Game created! Your Game ID is ${newGameId} and color is ${JSON.parse(event.data).color}`,
            );
          } else if (type === "start") {
            setPlaying(true); // Start the game when both players are connected
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        if (gameId) {
          setTimeout(setupWebSocket, 3000);
        }
      };

      socketRef.current = ws;
    }
  };

  useEffect(() => {
    // setupWebSocket();

    return () => {
      // socketRef.current?.close(); // Cleanup WebSocket connection when the component unmounts
    };
  }, [action, gameId]); // Dependency array to recreate the WebSocket connection if `action` or `gameId` changes
  const handleToggle = () => {
    if (!hasToggled.current) {
      setReverseBoard((prev) => !prev);
      // hasToggled.current = true; // Prevent further toggling
    }
  };
  const newGame = () => {
    setPlaying(false);
    setFen(engine.newGame());
    setHistory([]);
    setIsHost(true);
    setGameId(null);
    setWhiteConnected(false);
    setBlackConnected(false);
  };

  const joinGame = () => {
    setGameId(joinCode);
    setIsHost(false);
  };

  const handleSubmit = () => {
    if (action === "create") {
      newGame();
      setupWebSocket(); // Set up WebSocket connection for creating a game
    } else if (action === "join") {
      joinGame();
      setupWebSocket(); // Set up WebSocket connection for joining a game
    }
  };

  const doMove = useCallback(
    (currentFen: engine.Fen, from: engine.Square, to: engine.Square) => {
      try {
        const move = engine.move(currentFen, from, to);
        if (!move) return currentFen;

        const [newFen, action] = move;

        if (engine.isGameOver(newFen)) {
          onGameCompleted(engine.getGameWinner(newFen));
          newGame();
          return newFen;
        }

        setFen(newFen);
        setHistory((prevHistory) => [...prevHistory, action]);

        // Send move to server only if it's the current player's turn
        if (socketRef.current && gameId) {
          const isWhiteTurn = engine.isWhiteTurn(newFen);
          const isBlackTurn = engine.isBlackTurn(newFen);

          if (
            (playerColor === "white" && isWhiteTurn) ||
            (playerColor === "black" && isBlackTurn)
          ) {
            socketRef.current.send(
              JSON.stringify({
                type: "move",
                gameId,
                move: { from, to },
                fen: newFen,
              }),
            );
          }
        }

        return newFen;
      } catch (error) {
        console.error("Invalid move:", error);
        return currentFen;
      }
    },
    [onGameCompleted, playerColor],
  );

  const onDragStart = ({
    sourceSquare: from,
  }: Pick<BoardMove, "sourceSquare">) => {
    const isWhiteTurn = engine.isWhiteTurn(fen);
    const isBlackTurn = engine.isBlackTurn(fen);

    // Allow drag only if it's the player's turn and the piece is movable
    if (playerColor === "white" && isWhiteTurn) {
      return isPlaying && engine.isMoveable(fen, from);
    }

    if (playerColor === "black" && isBlackTurn) {
      return isPlaying && engine.isMoveable(fen, from);
    }

    return false;
  };

  const onMovePiece = ({ sourceSquare: from, targetSquare: to }: BoardMove) => {
    const newFen = doMove(fen, from, to);
    if (socketRef.current && gameId) {
      socketRef.current.send(
        JSON.stringify({
          type: "move",
          gameId,
          move: { from, to },
          fen: newFen,
        }),
      );
    }
    return newFen;
  };

  useEffect(() => {
    if (isPlaying) {
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
    }
  }, [isPlaying, fen, whiteBot, blackBot, doMove]);

  useEffect(() => {
    if (whiteConnected && blackConnected && action === "join") {
      // Notify the server to start the game when both players are connected
      if (socketRef.current && gameId) {
        socketRef.current.send(JSON.stringify({ type: "start", gameId }));
        setPlaying(true); 
      }
    }
  }, [whiteConnected, blackConnected, action, gameId]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Phone size
        setWidth(320);
      } else if (window.innerWidth < 768) {
        // Tablet size
        setWidth(350);
      } else {
        // Larger screens
        setWidth(650);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);
  const handleClick = () => {
    // Clear the timeout if it exists
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    //@ts-ignore
    clickTimeout.current = setTimeout(() => {
      setModalOpen(true); 
      clickTimeout.current = null; 
    }, 250);
  };

  const handleDoubleClick = () => {
    // Clear timeout and close modal
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    setModalOpen(false);
  };
  return (
    <div className="w-full  rounded-lg">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-green-300">
              Click for Play
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full bg-black">
            <div className="text-center font-bold flex flex-col justify-around items-center text-slate-500 gap-y-3 lg:space-y-0 ">
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

              <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                <button
                  className="m-1 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => setPlaying((prev) => !prev)}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  className="m-1 p-2 mb-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={newGame}
                >
                  Reset
                </button>
              </div>
              <select
                className="p-2 border rounded bg-gray-700 text-white"
                value={action}
                onChange={(e) => setAction(e.target.value as "create" | "join")}
              >
                <option value="create">Create Game</option>
                <option value="join">Join Game</option>
              </select>
              {action === "join" && (
                <input
                  type="text"
                  placeholder="Enter Game ID"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="p-2 border rounded bg-gray-700 text-white ml-2"
                />
              )}
              <button
                className="m-1.5 p-2 text-white rounded hover:bg-green-600 transition-colors ml-2"
                onClick={handleSubmit}
              >
                {action === "create" ? "Create Game" : "Join Game"}
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <button
        className="m-1.5 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-xs md:text-base"
        onClick={handleToggle}
      >
        Toggle Board Orientation
      </button>

      <div className="flex justify-center pb-2  w-full">
        <div
          className="relative w-full max-w-screen-sm"
          style={{ maxHeight: "calc(100vh - 100px)", aspectRatio: "1/1" }}
        >
          <div className="flex justify-center">
            <div className="w-full max-w-[650px]">
              <Chessboard
                width={width}
                position={fen}
                //@ts-ignore
                onDragStart={onDragStart}
                onDrop={onMovePiece}
                orientation={reverseBoard ? "black" : "white"}
                // boardStyle={{
                //   width: '100%', // Full width of the container
                //   height: '100%',
                // }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
