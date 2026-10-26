import { Autor } from "../models/Autor";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { AppError } from "../utils/AppError";
import { validarTextoObrigatorio } from "../utils/Validacoes";

export class AutorService {
  constructor(
    private readonly autorRepository: AutorRepository,
    private readonly livroRepository: LivroRepository,
  ) {}

  async cadastrar(nome: string, nacionalidade: string): Promise<Autor> {
    const nomeValido = validarTextoObrigatorio(nome, "nome");
    const nacionalidadeValida = validarTextoObrigatorio(
      nacionalidade,
      "nacionalidade",
    );
    await this.garantirNomeUnico(nomeValido);

    const id = await this.autorRepository.proximoId();
    return this.autorRepository.salvar(
      new Autor(id, nomeValido, nacionalidadeValida),
    );
  }

  async listar(): Promise<Autor[]> {
    return this.autorRepository.listar();
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.autorRepository.buscarPorId(id);
    if (!autor) {
      throw new AppError(`Autor com ID ${id} não encontrado.`);
    }
    return autor;
  }

  async atualizar(
    id: number,
    nome: string,
    nacionalidade: string,
  ): Promise<Autor> {
    const autor = await this.buscarPorId(id);
    const nomeValido = validarTextoObrigatorio(nome, "nome");
    const nacionalidadeValida = validarTextoObrigatorio(
      nacionalidade,
      "nacionalidade",
    );
    await this.garantirNomeUnico(nomeValido, id);

    autor.nome = nomeValido;
    autor.nacionalidade = nacionalidadeValida;
    return this.autorRepository.salvar(autor);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    const livros = await this.livroRepository.buscarPorAutor(id);
    if (livros.length > 0) {
      throw new AppError(
        "Não é possível remover: o autor possui livros cadastrados.",
      );
    }
    await this.autorRepository.remover(id);
  }

  private async garantirNomeUnico(
    nome: string,
    ignorarId?: number,
  ): Promise<void> {
    const autores = await this.autorRepository.listar();
    const duplicado = autores.some(
      (a) => a.id !== ignorarId && a.nome.toLowerCase() === nome.toLowerCase(),
    );
    if (duplicado) {
      throw new AppError(`Já existe um autor cadastrado com o nome "${nome}".`);
    }
  }
}
