import { ChessBoard } from "../board/chessboard";
import { Player } from "../board/player";

export const Mainpage = () => {
  return (
    <div className="flex flex-col h-full w-full rounded-xl bg-customColor">
      <div className="h-[10%] flex justify-center items-center">
        <Player />
      </div>
      <div className="h-[80%] flex justify-center items-center">
        <ChessBoard1 />
      </div>
      <div className="h-[10%] flex justify-center items-center">
        <Player />
      </div>
    </div>
  );
};
