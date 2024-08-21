// pages/api/game/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../libs/prismadb';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const game = await db.game.findUnique({
      where: { id: Number(id) },
      include: { moves: true, messages: true, history: true },
    });

    if (game) {
      res.status(200).json(game);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
