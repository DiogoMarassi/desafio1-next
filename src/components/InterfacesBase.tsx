export interface Prato {
  id: number;
  nome: string;
  preco: string;
  data_lancamento: string;
  custo: number;
  ativo: boolean;
  alimentos: Alimento[];
}

export interface Alimento {
  id: number;
  nome: string;
  custo: number;
  peso: number;
  ativo: boolean;
}

export interface Usuario {
  id: number;
  nome: string;
  senha: string;
  email: string;
  cargo: 'ADMIN' | 'EDITOR' | 'LEITOR';
}