'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CardGroup } from '@/components/CardGroup';
import { Usuario, Prato } from '@/components/InterfacesBase';

export default function EditarUsuarioPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [pratos, setPratos] = useState<Prato[]>([]);
  const [associados, setAssociados] = useState<number[]>([]); // IDs de pratos já associados

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  /** Busca dados do usuário */
  useEffect(() => {
    if (!token || !id) return;

    async function fetchUsuario() {
      try {
        const res = await fetch(`http://localhost:2000/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar usuário');
        const data = await res.json();
        setUsuario(data);
      } catch {
        alert('Erro ao carregar usuário');
      }
    }

    fetchUsuario();
  }, [id, token]);

  /** Busca todos os pratos */
  useEffect(() => {
    if (!token) return;

    async function fetchPratos() {
      try {
        const res = await fetch('http://localhost:2000/api/pratos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPratos(data);
      } catch {
        alert('Erro ao carregar pratos');
      }
    }

    fetchPratos();
  }, [token]);

  /** Busca pratos associados ao usuário */
  useEffect(() => {
    if (!token || !id) return;

    async function fetchPratosAssociados() {
      try {
        const res = await fetch(
          `http://localhost:2000/api/autorizacoes/usuario/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Data deve ser lista de pratos autorizados
        setAssociados(data.map((p: Prato) => p.id));
      } catch {
        alert('Erro ao carregar pratos associados');
      }
    }

    fetchPratosAssociados();
  }, [id, token]);

  /** Adicionar prato ao usuário */
  async function handleAddPrato(pratoId: number) {
    if (!token) return;

    try {
      await fetch(`http://localhost:2000/api/usuarios/${id}/pratos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pratoIds: [pratoId] }),
      });
      setAssociados((prev) => [...prev, pratoId]);
    } catch {
      alert('Erro ao associar prato ao usuário');
    }
  }

  /** Remover prato do usuário */
  async function handleRemovePrato(pratoId: number) {
    if (!token) return;

    try {
      await fetch(`http://localhost:2000/api/usuarios/${id}/pratos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pratoIds: [pratoId] }),
      });
      setAssociados((prev) => prev.filter((p) => p !== pratoId));
    } catch {
      alert('Erro ao remover prato do usuário');
    }
  }

  /** Salvar alterações do usuário */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !token) return;

    try {
      const res = await fetch(`http://localhost:2000/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });
      if (!res.ok) throw new Error();
      alert('Usuário atualizado com sucesso!');
      router.push('/dashboard');
    } catch {
      alert('Erro ao salvar usuário');
    }
  };

  if (!usuario) return <p>Carregando...</p>;

  /** Monta cards de pratos */
  const pratosCards = pratos.map((p) => ({
    id: p.id,
    nome: `${p.nome} - R$${p.preco} - ${p.ativo ? 'Ativo' : 'Inativo'}`,
    alimentos: [],
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Editar Usuário #{id}</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <p className="text-black font-bold">Nome</p>
            <input
              className="w-full p-2 border rounded text-black"
              value={usuario.nome}
              onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
              placeholder="Nome do usuário"
            />
          </div>

          <div>
            <p className="text-black font-bold">Email</p>
            <input
              type="email"
              className="w-full p-2 border rounded text-black"
              value={usuario.email}
              onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
              placeholder="Email do usuário"
            />
          </div>

          <div>
            <p className="text-black font-bold">Cargo</p>
            <select
              className="w-full p-2 border rounded text-black"
              value={usuario.cargo}
              onChange={(e) =>
                setUsuario({ ...usuario, cargo: e.target.value as Usuario['cargo'] })
              }
            >
              <option value="LEITOR">Leitor</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            Salvar Alterações
          </button>
        </form>
      </div>

      <CardGroup
        title="Pratos Associados"
        cards={pratosCards}
        add={true}
        onEdit={handleAddPrato}
        onRemove={handleRemovePrato}
        associados={associados} // <--- passe para o CardGroup controlar Add/Remove
      />
    </div>
  );
}
