'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoAlimentoPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState<number>(0);
  const [peso, setPeso] = useState<number>(0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:2000/api/alimentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nome, custo, peso }),
      });

      if (!response.ok) throw new Error('Erro ao criar alimento');

      alert('Alimento criado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar alimento');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Adicionar Novo Alimento</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <p className="text-black font-bold">Nome</p>
          <input
            className="w-full p-2 border rounded text-black"
            placeholder="Nome do alimento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <p className="text-black font-bold">Custo</p>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded text-black"
            placeholder="Custo"
            value={custo}
            onChange={(e) => setCusto(parseFloat(e.target.value))}
          />
          <p className="text-black font-bold">Peso (kg)</p>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded text-black"
            placeholder="Peso (kg)"
            value={peso}
            onChange={(e) => setPeso(parseFloat(e.target.value))}
          />

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            Salvar Alimento
          </button>
        </form>
      </div>
    </div>
  );
}
