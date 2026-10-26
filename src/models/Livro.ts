import { IEntidade } from "./IEntidade";

export class Livro implements IEntidade {
  constructor(
    public readonly id: number,
    public titulo: string,
    public autorId: number,
    public anoPublicacao: number,
    public quantidadeTotal: number,
    public quantidadeDisponivel: number,
  ) {}

  estaDisponivel(): boolean {
    return this.quantidadeDisponivel > 0;
  }
}
