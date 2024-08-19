"use client";
import { TbLogout2 } from "react-icons/tb";
import { signOut } from "next-auth/react";

export const Logout = () => {
    const log = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div>
            <button 
                onClick={log} 
                className="flex items-center text-white font-extrabold p-1 transition"
            >
                <TbLogout2 className="text-white text-xl" />
                <span className="ml-2">Logout</span>
            </button>
        </div>
    );
};
