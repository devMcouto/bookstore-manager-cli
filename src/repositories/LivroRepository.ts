import { Livro } from "../models/Livro";
import { BaseRepository } from "./BaseRepository";

export class LivroRepository extends BaseRepository<Livro> {
  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    return [...this.itens.values()].filter((l) => l.autorId === autorId);
  }
}
