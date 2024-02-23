import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import { Nova_Mono, Nova_Square } from "next/font/google";
import BottomBar from "@/components/BottomBar";

const inter = Inter({ subsets: ["latin"] });

const novaMono = Nova_Mono({
  subsets: ['latin'],
  display: "swap",
  weight: '400',
  variable: '--font-nova-mono',
})

const novaSquare = Nova_Square({
  subsets: ['latin'],
  display: "swap",
  weight: '400',
  variable: '--font-nova-square',
})

export const metadata = {
  title: "Neko Sekai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${novaMono.variable} ${novaSquare.variable} font-sans`}>
      <body className={inter.className}>
        <TopBar />
        {children}
        <BottomBar />
      </body>
    </html>
  );
}
