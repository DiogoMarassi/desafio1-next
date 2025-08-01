// src/context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'LEITOR' | 'EDITOR' | 'ADMIN';

interface AuthContextProps {
  user: { role: UserRole, token: string } | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}
// Um Context em React é como uma variável global que pode ser usada por qualquer componente da aplicação — sem precisar passar props manualmente em cada nível.
// "Prop" vem de “property” e é como um componente React recebe informações externas.
// Uso de uma Prop:
/*
function Saudacao({ nome }: { nome: string }) {
  return <h1>Olá, {nome}</h1>
}

// uso:
<Saudacao nome="Diogo" />
*/


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ role: UserRole, token: string } | null>(null);
  const router = useRouter();

  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Login inválido');
      }

      const data = await response.json();
      const token = data.token;

      // Decodifica o token para extrair o cargo
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      const role: UserRole = payload.cargo;

      setUser({ role, token });
      localStorage.setItem('token', token); // opcional: salvar token
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Email ou senha inválidos');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
