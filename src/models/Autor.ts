import { IEntidade } from "./IEntidade";

export class Autor implements IEntidade {
  constructor(
    public readonly id: number,
    public nome: string,
    public nacionalidade: string,
  ) {}
}
