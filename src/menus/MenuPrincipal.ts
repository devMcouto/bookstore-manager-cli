import { AutorMenu } from "./AutorMenu";
import { LivroMenu } from "./LivroMenu";
import { ClienteMenu } from "./ClienteMenu";
import { EmprestimoMenu } from "./EmprestimoMenu";
import { Input } from "../utils/Input";

export class MenuPrincipal {
  constructor(
    private readonly autorMenu: AutorMenu,
    private readonly livroMenu: LivroMenu,
    private readonly clienteMenu: ClienteMenu,
    private readonly emprestimoMenu: EmprestimoMenu,
  ) {}

  async exibir(): Promise<void> {
    let sair = false;

    while (!sair) {
      console.log(`
=== BOOKSTORE MANAGER CLI ===
1 - Autores
2 - Livros
3 - Clientes
4 - Empréstimos
0 - Encerrar aplicação`);

      const opcao = await Input.perguntar("Escolha: ");

      switch (opcao) {
        case "1":
          await this.autorMenu.exibir();
          break;
        case "2":
          await this.livroMenu.exibir();
          break;
        case "3":
          await this.clienteMenu.exibir();
          break;
        case "4":
          await this.emprestimoMenu.exibir();
          break;
        case "0":
          sair = true;
          break;
        default:
          console.log("Opção inválida.");
      }
    }

    console.log("Aplicação encerrada. Até logo!");
  }
}
