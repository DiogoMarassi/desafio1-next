'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CardGroup } from '@/components/CardGroup';
import { Prato, Alimento } from '@/components/InterfacesBase';


export default function EditarPratoPage() {
  const params = useParams();
  const id = params?.id as string; // id do prato!

  const router = useRouter();
  const [prato, setPrato] = useState<Prato>({
    id: 0, // Pode ser ignorado no POST
    nome: '',
    preco: '',
    data_lancamento: '',
    custo: 0,
    ativo: true,
    alimentos: [],
  });

  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);

      // Decodifica o JWT
      const [, payloadBase64] = savedToken.split('.');

    }
  }, []);

  function handleAddAlimento(idAlimento: number) {
    if (!prato) return;
    const alimento = alimentos.find((a) => a.id === idAlimento);
    if (!alimento) return;

    setPrato({
      ...prato,
      alimentos: [...(prato.alimentos || []), alimento],
    });
  }

  function handleRemoveAlimento(idAlimento: number) {
    if (!prato) return;

    setPrato({
      ...prato,
      alimentos: (prato.alimentos || []).filter((a) => a.id !== idAlimento),
    });
  }
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

  // Busca os dados reais do prato ao carregar a página
  useEffect(() => {
    if (!token) return;
    if (!id) return;

    async function fetchPrato() {
      try {
        const response = await fetch(`http://localhost:2000/api/pratos/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Erro ao buscar prato');

        const data = await response.json();
        setPrato(data);
      } catch (error) {
        console.error('Erro ao carregar prato:', error);
        alert('Não foi possível carregar o prato.');
      }
    }

    fetchPrato();
  }, [id, token]);

  const handleSave = async (e: React.FormEvent) => {
    if (!token) return;

    e.preventDefault();

    if (!prato) return;

    const payload = {
      nome: prato.nome,
      preco: parseFloat(prato.preco),
      data_lancamento: prato.data_lancamento.split('T')[0], // só data
      custo: Number(prato.custo),
      alimentos: prato.alimentos.map(a => a.id),
    };
    try {
      const response = await fetch(`http://localhost:2000/api/pratos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar prato');
      }

      alert('Prato atualizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar prato:', error);
      alert('Não foi possível salvar o prato.');
    }
  };

  const alimentosCards = alimentos.map((a) => ({
    id: a.id,
    nome: `${a.nome} - R$${a.custo} - ${a.ativo ? 'Ativo' : 'Inativo'}`,
    alimentos: alimentos
  }));

  return (
    <div className="min-h-screen flex flex-row items-center justify-center bg-gray-100 p-6 gap-5">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-black">Adicionar prato</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex gap-5 justify-around items-center">
            <div>
              {/* Nome */}
              <p className="text-black font-bold">Nome</p>
              <input
                className="w-full p-2 border rounded text-black"
                onChange={(e) => setPrato({ ...prato, nome: e.target.value })}
                placeholder="Nome do prato"
              />

              {/* Preço */}
              <p className="text-black font-bold">Preço</p>
              <input
                type="text"
                className="w-full p-2 border rounded text-black"
                onChange={(e) => setPrato({ ...prato, preco: e.target.value })}
                placeholder="Preço (ex: 12.50)"
              />

              {/* Data de lançamento */}
              <p className="text-black font-bold">Data de lançamento</p>
              <input
                type="date"
                className="w-full p-2 border rounded text-black"
                onChange={(e) => setPrato({ ...prato, data_lancamento: e.target.value })}
              />

              {/* Custo */}
              <p className="text-black font-bold">Custo</p>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border rounded text-black"
                onChange={(e) => setPrato({ ...prato, custo: parseFloat(e.target.value) })}
                placeholder="Custo do prato"
              />

              {/* Ativo */}
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={prato.ativo}
                  onChange={(e) => setPrato({ ...prato, ativo: e.target.checked })}
                />
                Ativo
              </label>
            </div>

          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            Salvar Alterações
          </button>

        </form>
      </div>
      <CardGroup
        title="Alimentos"
        cards={alimentosCards}
        add={true}
        onEdit={handleAddAlimento}
        onRemove={handleRemoveAlimento}
      />
    </div>
  );
}
