import { AutorController } from "../controllers/AutorController";
import { Input } from "../utils/Input";

export class AutorMenu {
  constructor(private readonly controller: AutorController) {}

  async exibir(): Promise<void> {
    let voltar = false;
    while (!voltar) {
      console.log(`
        === AUTORES ===
    1 - Cadastrar autor
    2 - Listar autores
    3 - Consultar autor por ID
    4 - Atualizar autor
    5 - Remover autor
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
          console.log("Opção inválida.");
      }
    }
  }
}
