import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Nova_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const novaMono = Nova_Mono({
  subsets: ['latin'],
  display: "swap",
  weight: '400',
  variable: '--font-nova-mono',
})

export const metadata = {
  title: "Neko Sekai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${novaMono.variable} font-sans`}>
      <body className={inter.className}>
        {/* <NavBar /> */}
        {children}
      </body>
    </html>
  );
}
