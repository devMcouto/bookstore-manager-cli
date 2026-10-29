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

export function converterParaInteiro(
  valor: string,
  campo: string,
  minimo: number,
  maximo?: number,
): number {
  const numero = Number(valor);
  const acimaDoMaximo = maximo !== undefined && numero > maximo;
  if (
    valor.trim() === "" ||
    !Number.isInteger(numero) ||
    numero < minimo ||
    acimaDoMaximo
  ) {
    const faixa =
      maximo !== undefined ? `entre ${minimo}` : `maior ou igual a ${minimo}`;
    throw new AppError(
      `O campo "${campo}" deve ser um número inteiro ${faixa}.`,
    );
  }
  return numero;
}
