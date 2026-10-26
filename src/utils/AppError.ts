export class AppError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "AppError";
  }
}
