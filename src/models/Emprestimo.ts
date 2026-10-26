import { IEntidade } from "./IEntidade";

export class Emprestimo implements IEntidade {
  constructor(
    public readonly id: number,
    public readonly livroId: number,
    public readonly clienteId: number,
    public readonly dataEmprestimo: Date,
    public dataDevolucao: Date | null = null,
  ) {}

  estaAtivo(): boolean {
    return this.dataDevolucao === null;
  }
}
