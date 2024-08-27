import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

// Create HTTP server
const server = http.createServer((request, response) => {
  console.log(`${new Date()} Received request for ${request.url}`);
  response.end("Hi there");
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store clients and game information
let clients = new Map<string, { fen: string, clients: WebSocket[], colors: Map<WebSocket, string> }>();

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  // Send a toast notification when a client connects
  ws.send(JSON.stringify({ type: 'notification', message: 'You have connected to the game server' }));

  ws.on('message', (message: WebSocket.MessageEvent, isBinary: boolean) => {
    console.log('Message received:', message);
    try {
      const data = JSON.parse(message.toString());
      console.log('Parsed message:', data);
      const { type, gameId, move, fen } = data;

      if (type === 'create') {
        const newGameId = generateGameId();
        const color = Math.random() < 0.5 ? 'white' : 'black';
        clients.set(newGameId, { fen, clients: [ws], colors: new Map([[ws, color]]) });
        ws.send(JSON.stringify({ type: 'created', gameId: newGameId, color }));
        broadcast({ type: 'notification', message: `Game created with ID: ${newGameId}` });
      } else if (type === 'join') {
        const game = clients.get(gameId);
        if (game) {
          const color = game.clients.length % 2 === 0 ? 'white' : 'black';
          game.clients.push(ws);
          game.colors.set(ws, color);
          ws.send(JSON.stringify({ type: 'joined', fen: game.fen, color }));
          // Notify all clients in the game about the new connection and color assignment
          broadcast({ type: 'notification', message: `A new player has joined the game: ${gameId}`, gameId });
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
        }
      } else if (type === 'move') {
        const game = clients.get(gameId);
        if (game) {
          game.fen = fen;
          game.clients.forEach((client: WebSocket) => {
            if (client !== ws) {
              client.send(JSON.stringify({ type: 'move', move, fen, gameId }));
            }
          });
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.forEach((game, gameId) => {
      game.clients = game.clients.filter((client: WebSocket) => client !== ws);
      if (game.clients.length === 0) {
        clients.delete(gameId);
      } else {
        // Notify remaining clients in the game about the disconnection
        broadcast({ type: 'notification', message: `A player has left the game: ${gameId}`, gameId });
      }
    });
  });
});

// Generate unique game ID
function generateGameId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Broadcast message to all clients
function broadcast(message: object) {
  clients.forEach(game => {
    game.clients.forEach(client => {
      client.send(JSON.stringify(message));
    });
  });
}

// Start HTTP server
server.listen(8080, () => {
  console.log('WebSocket server is listening on ws://localhost:8080');
});
