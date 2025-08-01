// src/app/layout.tsx
import '@/styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from '@/components/Navbar';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Navbar />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
