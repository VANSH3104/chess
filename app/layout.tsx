import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterContest } from "../app/contest/tostercontest.tsx"
import AuthContext from "./contest/authcontext"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Message",
  description: "Message",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
        <ToasterContest />
        {children}
        </AuthContext>
        </body>
    </html>
  );
}