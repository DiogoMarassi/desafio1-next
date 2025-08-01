'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditarAlimentoPage() {
  const params = useParams(); // retorna um objeto
  const id = params?.id as string; // cast para string

  const router = useRouter();
  const [alimento, setAlimento] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchAlimento() {
      try {
        const response = await fetch(`http://localhost:2000/api/alimentos/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar alimento');

        const data = await response.json();
        setAlimento(data); 
      } catch (error) {
        console.error(error);
        alert('Não foi possível carregar o alimento.');
      }
    }

    fetchAlimento();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:2000/api/alimentos/${alimento.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // caso precise de token
        },
        body: JSON.stringify({
          nome: alimento.nome,
          custo: alimento.custo,
          peso: alimento.peso,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar alimento');
      }

      alert('Alimento atualizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar alimento:', error);
      alert('Não foi possível salvar o alimento.');
    }
  };

  if (!alimento) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Editar Alimento #{id}</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <p className="text-black font-bold">Nome</p>
          <input
            className="w-full p-2 border rounded text-black"
            value={alimento.nome}
            onChange={(e) => setAlimento({ ...alimento, nome: e.target.value })}
          />
          <p className="text-black font-bold">Custo</p>
          <input
            type="number"
            className="w-full p-2 border rounded text-black"
            value={alimento.custo}
            onChange={(e) => setAlimento({ ...alimento, custo: parseFloat(e.target.value) })}
          />
          <p className="text-black font-bold">Peso (kg)</p>
          <input
            type="number"
            className="w-full p-2 border rounded text-black"
            value={alimento.peso}
            onChange={(e) => setAlimento({ ...alimento, peso: parseFloat(e.target.value) })}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
