import { LivroController } from "../controllers/LivroController";
import { Input } from "../utils/Input";

export class LivroMenu {
  constructor(private readonly controller: LivroController) {}

  async exibir(): Promise<void> {
    let voltar = false;

    while (!voltar) {
      console.log(`
=== LIVROS ===
1 - Cadastrar livro
2 - Listar livros
3 - Consultar livro por ID
4 - Atualizar livro
5 - Remover livro
0 - Voltar`);

      const opcao = await Input.perguntar("Escolha: ");

      switch (opcao) {
        case "1":
          await this.controller.cadastrar();
          break;
        case "2":
          await this.controller.listar();
          break;
        case "3":
          await this.controller.consultar();
          break;
        case "4":
          await this.controller.atualizar();
          break;
        case "5":
          await this.controller.remover();
          break;
        case "0":
          voltar = true;
          break;
        default:
          console.log("\n✖ Opção inválida.");
      }
    }
  }
}
