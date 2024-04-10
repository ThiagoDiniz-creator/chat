import initDb from "@/db/initDb";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import "./globals.css";

initDb();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextChat",
  description: "NextChat - Chat em tempo real com Next.js e Socket.io",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-br'>
      <body className={`bg-gray-900 text-white ${inter.className} max-h-screen`}>
        <nav className='py-2 bg-gray-800'>
          <ul className='flex space-x-8 w-fit px-8 font-medium'>
            <NavItem href='/homepage'>Home</NavItem>
            <NavItem href='/chat'>Chat</NavItem>
            <NavItem href='/configuracoes'>Configurações</NavItem>
          </ul>
        </nav>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className='text-lg'>
      <Link className='hover:underline lowercase' href={href}>
        {children}
      </Link>
    </li>
  );
}
