import { Cliente } from "../models/Cliente";
import { BaseRepository } from "./BaseRepository";

export class CLienteRepository extends BaseRepository<Cliente> {
  async buscarPorEmail(email: string): Promise<Cliente | undefined> {
    return [...this.itens.values()].find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
  }
}
