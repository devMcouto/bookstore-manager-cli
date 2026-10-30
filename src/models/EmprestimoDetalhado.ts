import { Emprestimo } from "./Emprestimo";

export interface EmprestimoDetalhado {
  emprestimo: Emprestimo;
  tituloLivro: string;
  nomeCliente: string;
}
