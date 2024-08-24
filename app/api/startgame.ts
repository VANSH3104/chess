// pages/api/start-game.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {db} from "../libs/prismadb"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { whitePlayerId, blackPlayerId } = req.body;

    const game = await db.game.create({
      data: {
        whitePlayerId,
        blackPlayerId,
        status: 'PENDING',
      },
    });

    res.status(200).json(game);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
