import { Emprestimo } from "../models/Emprestimo";
import { BaseRepository } from "./BaseRepository";

export class EmprestimoRepository extends BaseRepository<Emprestimo> {
  async listarAtivos(): Promise<Emprestimo[]> {
    return [...this.itens.values()].filter((e) => e.estaAtivo());
  }
}
