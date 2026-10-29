import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { AppError } from "../utils/AppError";
import { validarEmail, validarTextoObrigatorio } from "../utils/Validacoes";

export class ClienteService {
  constructor(
    private readonly clienteRepository: ClienteRepository,
    private readonly emprestimoRepository: EmprestimoRepository,
  ) {}

  async cadastrar(
    nome: string,
    email: string,
    telefone: string,
  ): Promise<Cliente> {
    const nomeValido = validarTextoObrigatorio(nome, "nome");
    const emailValido = validarEmail(email);
    await this.garantirEmailUnico(emailValido);

    const id = await this.clienteRepository.proximoId();
    return this.clienteRepository.salvar(
      new Cliente(id, nomeValido, emailValido, telefone.trim()),
    );
  }

  async listar(): Promise<Cliente[]> {
    return this.clienteRepository.listar();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new AppError(`Cliente com ID ${id} não encontrado.`);
    }
    return cliente;
  }

  async atualizar(
    id: number,
    nome: string,
    email: string,
    telefone: string,
  ): Promise<Cliente> {
    const cliente = await this.buscarPorId(id);
    const nomeValido = validarTextoObrigatorio(nome, "nome");
    const emailValido = validarEmail(email);
    await this.garantirEmailUnico(emailValido, id);

    cliente.nome = nomeValido;
    cliente.email = emailValido;
    cliente.telefone = telefone.trim();
    return this.clienteRepository.salvar(cliente);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    const ativos = await this.emprestimoRepository.listarAtivos();
    if (ativos.some((e) => e.clienteId === id)) {
      throw new AppError(
        "Não é possivel remover: o cliente possui empréstimo ativo.",
      );
    }
    await this.clienteRepository.remover(id);
  }

  private async garantirEmailUnico(
    email: string,
    ignorarId?: number,
  ): Promise<void> {
    const existente = await this.clienteRepository.buscarPorEmail(email);
    if (existente && existente.id !== ignorarId) {
      throw new AppError(
        `Já existe um cliente cadastrado com o e-mail "${email}".`,
      );
    }
  }
}
