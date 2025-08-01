'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState<'ADMIN' | 'EDITOR' | 'LEITOR'>('LEITOR');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:2000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          cargo,
        }),
      });

      if (!response.ok) throw new Error('Erro ao criar usuário');

      alert('Usuário criado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar usuário');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Adicionar Novo Usuário</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <input
            className="w-full p-2 border rounded text-black"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            className="w-full p-2 border rounded text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 border rounded text-black"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded text-black"
            value={cargo}
            onChange={(e) => setCargo(e.target.value as any)}
          >
            <option value="LEITOR">Leitor</option>
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            Salvar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}
