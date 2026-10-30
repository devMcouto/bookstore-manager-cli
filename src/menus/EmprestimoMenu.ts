import { EmprestimoController } from "../controllers/EmprestimoController";
import { Input } from "../utils/Input";

export class EmprestimoMenu {
  constructor(private readonly controller: EmprestimoController) {}

  async exibir(): Promise<void> {
    let voltar = false;

    while (!voltar) {
      console.log(`
=== EMPRÉSTIMOS ===
1 - Realizar empréstimo
2 - Registrar devolução
3 - Listar todos os empréstimos
4 - Listar empréstimos ativos
5 - Consultar empréstimo por ID
0 - Voltar`);

      const opcao = await Input.perguntar("Escolha: ");

      switch (opcao) {
        case "1":
          await this.controller.realizar();
          break;
        case "2":
          await this.controller.devolver();
          break;
        case "3":
          await this.controller.listar(false);
          break;
        case "4":
          await this.controller.listar(true);
          break;
        case "5":
          await this.controller.consultar();
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
