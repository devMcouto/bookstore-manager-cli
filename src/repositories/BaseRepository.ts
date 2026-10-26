import { IEntidade } from "../models/IEntidade";
import { IRepository } from "./IRepository";

export abstract class BaseRepository<
  T extends IEntidade,
> implements IRepository<T> {
  protected readonly itens = new Map<number, T>();
  private ultimoId = 0;

  async proximoId(): Promise<number> {
    return ++this.ultimoId;
  }
  async salvar(item: T): Promise<T> {
    this.itens.set(item.id, item);
    if (item.id > this.ultimoId) {
      this.ultimoId = item.id;
    }
    return item;
  }

  async buscarPorId(id: number): Promise<T | undefined> {
    return this.itens.get(id);
  }

  async listar(): Promise<T[]> {
    return [...this.itens.values()];
  }

  async remover(id: number): Promise<boolean> {
    return this.itens.delete(id);
  }
}
