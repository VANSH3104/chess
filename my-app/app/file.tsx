    "use client"
    // import { Mainpage } from "./()/components/dashboard_comp/mainpage";
    import { Section } from "./()/components/dashboard_comp/section";
    import { Sidebar } from "./()/components/dashboard_comp/sidebar";
    import * as engine from './()/components/board/utils/engine';
    import { Title } from "./()/components/dashboard_comp/title";
    import ChessboardComponent from './()/components/board/component/chessgame';
import type { AvailableBots } from './()/components/board/utils/bots';
import bots from './()/components/board/utils/bots';
import { useState } from "react";
   const MainGame = () => {
        const [history, setHistory] = useState<Array<engine.Move>>([]);
        return (
            <div className="flex h-screen w-full overflow-hidden">
                <div className="w-full lg:w-[100%] h-full md:flex flex-colmd:overflow-hidden overflow-auto">
                    <div className="lg:w-[80%] md:w-[70%]  w-full h-full  md:overflow-hidden p-2 bg-neutral-700 ">
                        <div className="flex flex-col h-full w-full rounded-xl bg-customColor">
      <div className="h-full flex justify-center items-center">
        <div className="container mx-auto p-4 ">
      <ChessboardComponent
        setHistory={setHistory}
        bots={bots}
        onGameCompleted={winner => {
          global.alert(
            `${winner === 'b' ? 'Black' : winner === 'w' ? 'White' : 'No one'} is the winner!`
          );
        }}
      />
    </div>
      </div>
    </div>
                    </div>
                    <div className="lg:w-[20%] md:w-[30%] w-full
                     md:overflow-hidden h-full p-2 bg-neutral-700 hidden md:block">
                        <Section history={history} />
                    </div>
                </div>
            </div>
        );
    };
    

    export default MainGame;
