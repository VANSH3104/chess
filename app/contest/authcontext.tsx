"use client"
import { SessionProvider} from "next-auth/react"
import React from "react"
interface AuthContextprop {
    children: React.ReactNode
}
export default function AuthContext({
    children
}:AuthContextprop){
    return <SessionProvider>{children}</SessionProvider>
}