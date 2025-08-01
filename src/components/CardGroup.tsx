'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CardExpansivo from '@/components/CardExpansivo';
import { useParams } from 'next/navigation';
import { Alimento, Prato, Usuario } from './InterfacesBase';

interface CardGroupProps {
  title: string;
  cards: { id: number; nome: string, alimentos: Alimento[] }[];
  editable?: boolean;
  add?: boolean;
  onEdit?: (id: number) => void;
  onRemove?: (id: number) => void;
}


export function CardGroup({
  title,
  cards,
  editable = false,
  add = false,
  onEdit,
  onRemove,
}: CardGroupProps) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [associados, setAssociados] = useState<number[]>([]);
  const params = useParams();
  const idPrato = params?.id as string;
  const router = useRouter()

  const handleNovoAlimento = () => router.push('/alimentos/novo');
  const handleNovoPrato = () => router.push('/pratos/novo');
  const handleNovoUsuario = () => router.push('/usuarios/novo');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  return (
    // ADICIOANR DO CARD GROUP
    <div className="bg-white p-5 rounded-xl shadow-md w-full max-w-md">
      <div className="flex flex-row justify-around items-center border-b pb-5">
        <h2 className="font-bold text-2xl text-gray-800 text-center">{title}</h2>
        <button
          onClick={() => {
            if (title.includes('Alimento')) handleNovoAlimento();
            else if (title.includes('Prato')) handleNovoPrato();
            else if (title.includes('Usuário')) handleNovoUsuario();
          }}
          className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Adicionar
        </button>
      </div>
      <ul className="space-y-3">
        {cards.map((card) => (
          <li
            key={card.id}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-xl">{card.nome}</span>

              {editable && (

                <div className="flex gap-2">

                  <button
                    onClick={() => onEdit && onEdit(card.id)}
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onRemove && onRemove(card.id)}
                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    Remover
                  </button>
                </div>
              )}
              {add && (
                // MUDANÇAS ADICIONAR REMOVER
                <div className="flex gap-2">
                  {associados.includes(card.id) ? (
                    <button
                      onClick={() => {
                        setAssociados((prev) => prev.filter((id) => id !== card.id));
                        onRemove && onRemove(card.id); //Atualiza o prato no pai
                      }}
                      className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                    >
                      Remover
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAssociados((prev) => [...prev, card.id]);
                        onEdit && onEdit(card.id); //Atualiza o prato no pai
                      }}
                      className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              )}
            </div>

            {title === "Pratos Autorizados" && card.alimentos && card.alimentos.length > 0 && (
              <div className="mt-2 space-y-1">
                {card.alimentos.map((alimento: any) => (
                  <CardExpansivo
                    key={alimento.id}
                    id={alimento.id}
                    name={alimento.nome}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
