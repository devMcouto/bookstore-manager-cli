import { IEntidade } from "../models/IEntidade";

export interface IRepository<T extends IEntidade> {
  proximoId(): Promise<number>;
  salvar(item: T): Promise<T>;
  buscarPorId(id: number): Promise<T | undefined>;
  listar(): Promise<T[]>;
  remover(id: number): Promise<boolean>;
}
