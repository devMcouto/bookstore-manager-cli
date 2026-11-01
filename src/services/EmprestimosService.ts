import { Emprestimo } from "../models/Emprestimo";
import { EmprestimoDetalhado } from "../models/EmprestimoDetalhado";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { AppError } from "../utils/AppError";

export class EmprestimoService {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly livroRepository: LivroRepository,
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async realizar(livroId: number, clienteId: number): Promise<Emprestimo> {
    const livro = await this.livroRepository.buscarPorId(livroId);
    if (!livro) {
      throw new AppError(`Livro com ID ${livroId} não encontrado.`);
    }

    const cliente = await this.clienteRepository.buscarPorId(clienteId);
    if (!cliente) {
      throw new AppError(`Cliente com ID ${clienteId} não encontrado.`);
    }

    if (!livro.estaDisponivel()) {
      throw new AppError(
        `O livro "${livro.titulo}" não possui exemplares disponíveis.`,
      );
    }

    await this.garantirSemEmprestimoAtivoDuplicado(livroId, clienteId);

    const id = await this.emprestimoRepository.proximoId();
    const emprestimo = new Emprestimo(id, livroId, clienteId, new Date());

    livro.quantidadeDisponivel -= 1;
    await this.livroRepository.salvar(livro);
    return this.emprestimoRepository.salvar(emprestimo);
  }

  async devolver(emprestimoId: number): Promise<Emprestimo> {
    const emprestimo = await this.buscarPorId(emprestimoId);

    if (!emprestimo.estaAtivo()) {
      throw new AppError("Este empréstimo já foi devolvido.");
    }

    emprestimo.dataDevolucao = new Date();
    await this.emprestimoRepository.salvar(emprestimo);

    const livro = await this.livroRepository.buscarPorId(emprestimo.livroId);
    if (livro) {
      livro.quantidadeDisponivel += 1;
      await this.livroRepository.salvar(livro);
    }
    return emprestimo;
  }

  async listar(apenasAtivos = false): Promise<EmprestimoDetalhado[]> {
    const emprestimos = apenasAtivos
      ? await this.emprestimoRepository.listarAtivos()
      : await this.emprestimoRepository.listar();

    const resultado: EmprestimoDetalhado[] = [];
    for (const emprestimo of emprestimos) {
      resultado.push(await this.detalhar(emprestimo));
    }
    return resultado;
  }

  async buscarPorId(id: number): Promise<Emprestimo> {
    const emprestimo = await this.emprestimoRepository.buscarPorId(id);
    if (!emprestimo) {
      throw new AppError(`Empréstimo com id ${id} não encontrado.`);
    }
    return emprestimo;
  }

  async buscarDetalhadoPorId(id: number): Promise<EmprestimoDetalhado> {
    return this.detalhar(await this.buscarPorId(id));
  }

  private async detalhar(emprestimo: Emprestimo): Promise<EmprestimoDetalhado> {
    const livro = await this.livroRepository.buscarPorId(emprestimo.livroId);
    const cliente = await this.clienteRepository.buscarPorId(
      emprestimo.clienteId,
    );
    return {
      emprestimo,
      tituloLivro: livro ? livro.titulo : "Livro removido",
      nomeCliente: cliente ? cliente.nome : "Cliente removido",
    };
  }
  private async garantirSemEmprestimoAtivoDuplicado(
    livroId: number,
    clienteId: number,
  ): Promise<void> {
    const ativos = await this.emprestimoRepository.listarAtivos();
    const duplicado = ativos.some(
      (e) => e.livroId === livroId && e.clienteId === clienteId,
    );
    if (duplicado) {
      throw new AppError(
        "Este cliente já possui um empréstimo ativo deste livro.",
      );
    }
  }
}
