'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // futuramente remover token/autenticação
    router.push('/login');
  };

  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/') return 'Login';
    return '';
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <Link href="/dashboard" className="text-xl font-bold text-blue-600">
        Desafio1 (Node + Next)
      </Link>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md text-sm font-medium transition duration-150"
      >
        Logout
      </button>
    </nav>
  );
}
