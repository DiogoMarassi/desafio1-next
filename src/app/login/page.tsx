'use client';
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function LoginPage() {
  const router = useRouter()

  // useState cria variáveis "reativas"
  // [email, setEmail]: email é o valor atual, setEmail muda o valor e re-renderiza o componente
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  // Estado para mostrar erros de login
  const [erro, setErro] = useState<string | null>(null)

  // Função chamada quando o usuário envia o formulário
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Evita reload da página

    try {
      // Chamada para o back-end de login
      const response = await fetch('http://localhost:2000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      if (!response.ok) {
        setErro('Email ou senha inválidos')
        return
      }

      const data = await response.json() // Recebe { token: "..." }
      const token = data.token

      // Armazenar token localmente (para requests futuros)
      localStorage.setItem('token', token)

      // Decodificar o JWT para saber o cargo do usuário
      const [, payloadBase64] = token.split('.')       // Pega a segunda parte do token
      const payload = JSON.parse(atob(payloadBase64))  // Decodifica base64 em JSON
      const cargo = payload.cargo                      // admin, editor ou leitor

      // Armazenar também o cargo no localStorage
      localStorage.setItem('role', cargo)

      // Redirecionar para o dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao fazer login', error)
      setErro('Erro no servidor. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Acesso à Plataforma</h2>

        {/* Se houver erro, mostra um alerta */}
        {erro && <p className="text-red-600 mb-4 text-center">{erro}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)} // atualiza o state
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block mb-1 font-medium text-gray-700">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
