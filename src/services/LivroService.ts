import { Livro } from "../models/Livro";
import { LivroDetalhado } from "../models/LivroDetalhado";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { AppError } from "../utils/AppError";
import { validarTextoObrigatorio } from "../utils/Validacoes";

export class LivroService {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository,
    private readonly emprestimoRepository: EmprestimoRepository,
  ) {}

  async cadastrar(
    titulo: string,
    autorId: number,
    anoPublicacao: number,
    quantidade: number,
  ): Promise<Livro> {
    const tituloValido = validarTextoObrigatorio(titulo, "título");
    await this.garantirAutorExiste(autorId);
    await this.garantirLivroUnico(tituloValido, autorId);

    const id = await this.livroRepository.proximoId();
    const livro = new Livro(
      id,
      tituloValido,
      autorId,
      anoPublicacao,
      quantidade,
      quantidade,
    );
    return this.livroRepository.salvar(livro);
  }

  async listar(): Promise<LivroDetalhado[]> {
    const livros = await this.livroRepository.listar();
    const resultado: LivroDetalhado[] = [];
    for (const livro of livros) {
      const autor = await this.autorRepository.buscarPorId(livro.autorId);
      resultado.push({
        livro,
        nomeAutor: autor ? autor.nome : "Autor desconhecido",
      });
    }
    return resultado;
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.livroRepository.buscarPorId(id);
    if (!livro) {
      throw new AppError(`Livro com ID ${id} não encontrado.`);
    }
    return livro;
  }

  async buscarDetalhadoPorId(id: number): Promise<LivroDetalhado> {
    const livro = await this.buscarPorId(id);
    const autor = await this.autorRepository.buscarPorId(livro.autorId);
    return { livro, nomeAutor: autor ? autor.nome : "Autor desconhecido" };
  }

  async atualizar(
    id: number,
    titulo: string,
    autorId: number,
    anoPublicacao: number,
    quantidade: number,
  ): Promise<Livro> {
    const livro = await this.buscarPorId(id);
    const tituloValido = validarTextoObrigatorio(titulo, "título");
    await this.garantirAutorExiste(autorId);
    await this.garantirLivroUnico(tituloValido, autorId, id);

    const emprestados = livro.quantidadeTotal - livro.quantidadeDisponivel;
    if (quantidade < emprestados) {
      throw new AppError(
        `A quantidade total não pode ser menor que os ${emprestados} exemplares emprestados.`,
      );
    }
    livro.titulo = tituloValido;
    livro.autorId = autorId;
    livro.anoPublicacao = anoPublicacao;
    livro.quantidadeTotal = quantidade;
    livro.quantidadeDisponivel = quantidade - emprestados;
    return this.livroRepository.salvar(livro);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const ativos = await this.emprestimoRepository.listarAtivos();
    if (ativos.some((e) => e.livroId === id)) {
      throw new AppError(
        "Não é possivel remover: o livro possui empréstimo ativo.",
      );
    }
    await this.livroRepository.remover(id);
  }

  private async garantirAutorExiste(autorId: number): Promise<void> {
    const autor = await this.autorRepository.buscarPorId(autorId);
    if (!autor) {
      throw new AppError(
        `Autor com ID ${autorId} não encontrado. Cadastre o autor antes.`,
      );
    }
  }

  private async garantirLivroUnico(
    titulo: string,
    autorId: number,
    ignorarId?: number,
  ): Promise<void> {
    const livros = await this.livroRepository.listar();
    const duplicado = livros.some(
      (l) =>
        l.id !== ignorarId &&
        l.autorId === autorId &&
        l.titulo.toLowerCase() === titulo.toLowerCase(),
    );
    if (duplicado) {
      throw new AppError(
        `Já existe o livro "${titulo}" cadastrado para esse autor.`,
      );
    }
  }
}
