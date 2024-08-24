// websocket-server.ts
import WebSocket, { WebSocketServer } from 'ws';
import Chess from 'chess.js';
import { db } from '../libs/prismadb';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const { type, data } = JSON.parse(message.toString());

    switch (type) {
      case 'JOIN_GAME':
        // Handle joining a game
        break;
      case 'MAKE_MOVE':
        await handleMove(data);
        break;
      case 'SEND_MESSAGE':
        await handleMessage(data);
        break;
      default:
        console.log('Unknown message type:', type);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

async function handleMove(data: { gameId: number, move: string }) {
  const game = await db.game.findUnique({ where: { id: data.gameId } });

  if (game && game.status === 'ONGOING') {
    const chess = new Chess(game.history[game.history.length - 1]?.boardState || Chess.START_FEN);
    const move = chess.move(data.move);
    
    if (move) {
      await db.move.create({
        data: {
          gameId: data.gameId,
          playerId: move.color === 'w' ? game.whitePlayerId : game.blackPlayerId,
          from: move.from,
          to: move.to,
        },
      });

      await db.game.update({
        where: { id: data.gameId },
        data: {
          history: {
            create: {
              moveId: (await db.move.findFirst({ orderBy: { createdAt: 'desc' } }))?.id || 0,
              boardState: chess.fen(),
            },
          },
          updatedAt: new Date(),
        },
      });

      // Broadcast the move to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'MOVE', data: { move: move.san, boardState: chess.fen() } }));
        }
      });
    }
  }
}

async function handleMessage(data: { gameId: number, playerId: number, content: string }) {
  await db.message.create({
    data: {
      gameId: data.gameId,
      playerId: data.playerId,
      content: data.content,
    },
  });

  // Broadcast the message to all clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'MESSAGE', data: { content: data.content, playerId: data.playerId } }));
    }
  });
}

console.log('WebSocket server is running on ws://localhost:8080');
