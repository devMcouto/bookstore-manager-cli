import { AppError } from "./AppError";

export function exibirErro(erro: unknown): void {
  if (erro instanceof AppError) {
    console.log(`${erro.message}`);
  } else {
    console.log("Ocorreu um erro inesperado:", erro);
  }
}
