import { IEntidade } from "./IEntidade";

export class Cliente implements IEntidade {
  constructor(
    public readonly id: number,
    public nome: string,
    public email: string,
    public telefone: string,
  ) {}
}
