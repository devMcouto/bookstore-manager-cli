import { ClienteController } from "../controllers/ClienteController";
import { Input } from "../utils/Input";

export class ClienteMenu {
  constructor(private readonly controller: ClienteController) {}

  async exibir(): Promise<void> {
    let voltar = false;

    while (!voltar) {
      console.log(`
=== CLIENTES ===
1 - Cadastrar cliente
2 - Listar clientes
3 - Consultar cliente por ID
4 - Atualizar cliente
5 - Remover cliente
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
