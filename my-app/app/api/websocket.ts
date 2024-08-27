// import { NextApiRequest, NextApiResponse } from 'next';
// import { Server as HttpServer } from 'http';
// import { Server as WebSocketServer, WebSocket } from 'ws';

// type WebSocketMessage = {
//   type: 'create' | 'join' | 'move' | 'joined' | 'created';
//   gameId?: string;
//   move?: {
//     from: string;
//     to: string;
//   };
//   fen?: string;
// };

// type Client = {
//   players: WebSocket[];
//   fen: string;
// };

// const clients: Map<string, Client> = new Map();

// const handler = (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     if (req.socket.server.ws) {
//       res.status(200).json({ success: true });
//       return;
//     }

//     const httpServer = req.socket.server as unknown as HttpServer;
//     const wss = new WebSocketServer({ noServer: true });

//     httpServer.on('upgrade', (request, socket, head) => {
//       wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//       });
//     });

//     wss.on('connection', (ws: WebSocket) => {
//       console.log('Client connected');

//       ws.on('message', (message: string) => {
//         try {
//           const { type, gameId, move, fen } = JSON.parse(message) as WebSocketMessage;

//           switch (type) {
//             case 'create':
//               const newGameId = generateUniqueGameId();
//               clients.set(newGameId, { players: [ws], fen: fen || '' });
//               ws.send(JSON.stringify({ type: 'created', gameId: newGameId, fen: fen || '' }));
//               break;

//             case 'join':
//               const client = clients.get(gameId || '');
//               if (client) {
//                 client.players.push(ws);
//                 ws.send(JSON.stringify({ type: 'joined', fen: client.fen }));
//                 broadcast(gameId, { type: 'joined', fen: client.fen });
//               }
//               break;

//             case 'move':
//               const game = clients.get(gameId || '');
//               if (game) {
//                 const newFen = movePiece(game.fen, move!); // Assert move as non-null
//                 game.fen = newFen;
//                 broadcast(gameId, { type: 'move', move, fen: newFen });
//               }
//               break;

//             default:
//               console.error('Unknown message type:', type);
//           }
//         } catch (error) {
//           console.error('Error processing WebSocket message:', error);
//         }
//       });

//       ws.on('close', () => {
//         console.log('Client disconnected');
//         clients.forEach((game, gameId) => {
//           game.players = game.players.filter(player => player !== ws);
//           if (game.players.length === 0) {
//             clients.delete(gameId);
//           }
//         });
//       });

//       ws.on('error', (error) => {
//         console.error('WebSocket error:', error);
//       });
//     });

//     req.socket.server.ws = wss;
//     res.status(200).json({ success: true });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

// const generateUniqueGameId = (): string => {
//   return Math.random().toString(36).substr(2, 9);
// };

// const movePiece = (fen: string, move: { from: string; to: string }): string => {
//   // Implement your move logic here
//   return fen;
// };

// const broadcast = (gameId: string, message: WebSocketMessage) => {
//   const game = clients.get(gameId);
//   if (game) {
//     game.players.forEach((player) => player.send(JSON.stringify(message)));
//   }
// };

// export default handler;
  