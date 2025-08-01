'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardGroup } from '@/components/CardGroup';
import { Alimento, Prato, Usuario } from '@/components/InterfacesBase';

interface JwtPayload {
  id: number;
  email: string;
  cargo: string;
  nome?: string; 
}

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [pratosAutorizados, setPratosAutorizados] = useState<Prato[]>([]);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [usuario, setUsuario] = useState<Usuario[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);

      const [, payloadBase64] = savedToken.split('.');
      const payload: JwtPayload = JSON.parse(atob(payloadBase64));

      setNomeUsuario(payload.nome ?? payload.email);
    }
  }, []);

  async function handleRemoveAlimento(id: number) {
    const confirmDelete = confirm('Deseja realmente remover este alimento?');
    if (!confirmDelete) return;

    await fetch(`http://localhost:2000/api/alimentos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setAlimentos((prev) => prev.filter((a) => a.id !== id));

    // Atualiza alimentos dentro de cada prato para refletir a remoção
    setPratosAutorizados((prev) =>
      prev.map((prato) => ({
        ...prato,
        alimentos: prato.alimentos.filter((a) => a.id !== id),
      }))
    );
  }

  async function handleRemovePrato(id: number) {
    const confirmDelete = confirm('Deseja realmente remover este prato?');
    if (!confirmDelete) return;
    await fetch(`http://localhost:2000/api/pratos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setPratosAutorizados((prev) => prev.filter((p) => p.id !== id));
  }

    async function handleRemoveusuario(id: number) {
    const confirmDelete = confirm('Deseja realmente remover este usuário?');
    if (!confirmDelete) return;
    await fetch(`http://localhost:2000/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsuario((prev) => prev.filter((p) => p.id !== id));
  }

  useEffect(() => {
    if (!token) return;

    async function fetchPratosAutorizados() {
      try {
        const response = await fetch(
          'http://localhost:2000/api/autorizacoes/pratos-pelo-token',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setPratosAutorizados([]); 
          return;
        }

        const data = await response.json();

        // Filtra apenas pratos ativos
        const ativos = (data || [])
          .filter((a: any) => a.prato?.ativo) // só pega pratos ativos
          .map((a: any) => ({
            ...a.prato,
            alimentos:
              a.prato.alimentos?.filter((alimento: any) => alimento.ativo) || [],
          }));

        setPratosAutorizados(ativos);
      } catch (error) {
        console.error('Erro ao carregar pratos autorizados:', error);
        setPratosAutorizados([]); 
      }
    }

    fetchPratosAutorizados();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchAlimentos() {
      try {
        const response = await fetch('http://localhost:2000/api/alimentos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAlimentos(data);
      } catch (error) {
        console.error('Erro ao carregar alimentos:', error);
      }
    }
    fetchAlimentos();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchUsuarios() {
      try {
        const response = await fetch('http://localhost:2000/api/usuarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    }
    fetchUsuarios();
  }, [token]);

  if (!token) {
    return (
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Você precisa estar logado!
          </h2>
          <p className="text-gray-600">
            Faça login para acessar o painel e visualizar seus dados.
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-7 rounded-md text-sm font-medium transition duration-150 mt-5"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  const alimentosCards = alimentos.map((a) => ({
    id: a.id,
    nome: `${a.nome} - R$${a.custo}`,
    alimentos: alimentos
  }));

  const pratosCards = pratosAutorizados.map((p) => ({
    id: p.id,
    nome: `${p.nome} - R$${p.preco}`,
    alimentos: p.alimentos
  }));

  const usuariosCards = usuario.map((u) => ({
    id: u.id,
    nome: `${u.nome} - ${u.email} (${u.cargo})`,
    alimentos: alimentos
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-6">
      <div>
        <h1 className="text-2xl font-bold mb-6 text-black flex">
            Bem-vindo {nomeUsuario}
        </h1>
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl w-full">
          <CardGroup
            title="Alimentos"
            cards={alimentosCards}
            editable={role === 'EDITOR' || role === 'ADMIN'}

            onEdit={(id) => router.push(`/alimentos/editar/${id}`)}
            onRemove={handleRemoveAlimento}
          />
        
          <CardGroup
            title="Pratos Autorizados"
            cards={pratosCards}
            editable={role === 'EDITOR' || role === 'ADMIN'}

            onEdit={(id) => router.push(`/pratos/editar/${id}`)}
            onRemove={handleRemovePrato}
          />

          {role === 'ADMIN' && usuario.length > 0 && (
            <CardGroup
              title="Usuários"
              cards={usuariosCards}
              editable={role === 'ADMIN'}

              onEdit={(id) => router.push(`/usuarios/editar/${id}`)}
              onRemove={handleRemoveusuario}
            />
          )}
        </div>
      </div>
    </div>
  );
}
