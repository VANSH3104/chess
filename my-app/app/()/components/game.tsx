"use client"
import { FaChessQueen } from "react-icons/fa";
import { useRouter } from "next/navigation"

export const Game = ()=>{
    const router = useRouter()
    const game = ()=>{
        router.push("/dashboard")
    }
    return (
        <button onClick={game} className="text-white font-extrabold flex p-1 transition">
        <FaChessQueen className="text-white text-xl" /> 
        <div className="text-bold pl-2">
        Game
        </div>
        </button>
    )
}