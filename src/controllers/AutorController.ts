import { AutorService } from "../services/AutorService";
import { Input } from "../utils/Input";
import { converterParaId } from "../utils/Validacoes";
import { exibirErro } from "../utils/exibirErro";

export class AutorController {
  constructor(private readonly autorService: AutorService) {}

  async cadastrar(): Promise<void> {
    try {
      const nome = await Input.perguntar("Nome: ");
      const nacionalidade = await Input.perguntar("Nacionalidade: ");
      const autor = await this.autorService.cadastrar(nome, nacionalidade);
      console.log(`Autor cadastrado com ID ${autor.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async listar(): Promise<void> {
    try {
      const autores = await this.autorService.listar();
      if (autores.length === 0) {
        console.log("Nenhum autor cadastrado.");
        return;
      }
      console.log("--- Autores ---");
      autores.forEach((a) =>
        console.log(`[${a.id}] ${a.nome} (${a.nacionalidade})`),
      );
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async consultar(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do autor: "));
      const autor = await this.autorService.buscarPorId(id);
      console.log(`[${autor.id}] ${autor.nome} (${autor.nacionalidade})`);
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async atualizar(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do autor: "));
      await this.autorService.buscarPorId(id);
      const nome = await Input.perguntar("Novo nome: ");
      const nacionalidade = await Input.perguntar("Nova nacionalidade: ");
      await this.autorService.atualizar(id, nome, nacionalidade);
      console.log("Autor atualizado com sucesso.");
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async remover(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do autor: "));
      await this.autorService.remover(id);
      console.log("Autor removido com sucesso.");
    } catch (erro) {
      exibirErro(erro);
    }
  }
}
