import { LivroService } from "../services/LivroService";
import { LivroDetalhado } from "../models/LivroDetalhado";
import { Input } from "../utils/Input";
import { converterParaId, converterParaInteiro } from "../utils/Validacoes";
import { exibirErro } from "../utils/exibirErro";

export class LivroController {
  constructor(private readonly livroService: LivroService) {}

  async cadastrar(): Promise<void> {
    try {
      const titulo = await Input.perguntar("Título:");
      const autorId = converterParaId(await Input.perguntar("ID do autor: "));
      const ano = converterParaInteiro(
        await Input.perguntar("Ano de publicação: "),
        "ano de publicação",
        1000,
        new Date().getFullYear(),
      );
      const quantidade = converterParaInteiro(
        await Input.perguntar("Quantidade de exemplares: "),
        "quantidade",
        1,
      );
      const livro = await this.livroService.cadastrar(
        titulo,
        autorId,
        ano,
        quantidade,
      );
      console.log(`Livro cadastrado com ID ${livro.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  async listar(): Promise<void> {
    try {
      const livros = await this.livroService.listar();
      if (livros.length === 0) {
        console.log("Nenhum livro cadastrado.");
        return;
      }
      console.log("--- Livros ---");
      livros.forEach((item) => this.exibirLivro(item));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  async consultar(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do livro: "));
      const item = await this.livroService.buscarDetalhadoPorId(id);
      console.log();
      this.exibirLivro(item);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  async atualizar(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do livro: "));
      await this.livroService.buscarPorId(id);

      const titulo = await Input.perguntar("Novo título: ");
      const autorId = converterParaId(await Input.perguntar("ID do autor: "));
      const ano = converterParaInteiro(
        await Input.perguntar("Ano de publicação"),
        "ano de publicação",
        1000,
        new Date().getFullYear(),
      );
      const quantidade = converterParaInteiro(
        await Input.perguntar("Quantidade total de exemplares: "),
        "quantidade",
        1,
      );

      await this.livroService.atualizar(id, titulo, autorId, ano, quantidade);
      console.log("Livro atualizado com sucesso.");
    } catch (erro) {
      exibirErro(erro);
    }
  }

  async remover(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do livro: "));
      await this.livroService.remover(id);
      console.log("\n✔ Livro removido com sucesso.");
    } catch (erro) {
      exibirErro(erro);
    }
  }

  private exibirLivro({ livro, nomeAutor }: LivroDetalhado): void {
    console.log(
      `[${livro.id}] ${livro.titulo} - ${nomeAutor} (${livro.anoPublicacao}) | ` +
        `Disponíveis: ${livro.quantidadeDisponivel}/${livro.quantidadeTotal}`,
    );
  }
}
