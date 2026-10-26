import { AppError } from "./AppError";

export function validarTextoObrigatorio(valor: string, campo: string): string {
  const limpo = valor.trim();
  if (!limpo) {
    throw new AppError(`O campo "${campo}" é obrigatório.`);
  }
  return limpo;
}

export function converterParaId(valor: string): number {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError("Informe um ID válido(número inteiro positivo).");
  }
  return numero;
}
