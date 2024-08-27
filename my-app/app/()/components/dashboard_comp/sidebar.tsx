import { Game } from "../game";
import { Logout } from "./lagout";

export const Sidebar = () => {
    return (
        <div className="rounded-xl bg-customColor w-full h-full items-center p-2 pt-5">
            <div className="pb-4">
            <div className="text-white p-2 bg-neutral-700 hover:bg-neutral-600 font-extrabold rounded-xl">
                <Game />
            </div>
            </div>
            <div className="pb-4">
            <div className="text-white p-2 bg-neutral-700 hover:bg-neutral-600 font-extrabold rounded-xl">
                <Logout />
            </div>
            </div>
        </div>
    );
}
