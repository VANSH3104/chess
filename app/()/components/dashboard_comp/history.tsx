"use client"
import { useRouter } from "next/navigation";
import { GrHistory } from "react-icons/gr";
export const HistoryBar = ()=>{
    const router = useRouter()
    const handlehistory = ()=>{
        router.push("/history")
    }
    return (
        <button onClick={handlehistory} className="flex items-center text-white font-extrabold p-1 transition">
        <GrHistory className="text-white text-xl" /> 
        <div className="text-bold pl-2">
        History
        </div>
        </button>
    )
}