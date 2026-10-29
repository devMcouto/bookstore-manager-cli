import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { EmprestimoRepository } from "./repositories/EmprestimoRepository";
import { AutorService } from "./services/AutorService";
import { LivroService } from "./services/LivroService";
import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { AutorMenu } from "./menus/AutorMenu";
import { LivroMenu } from "./menus/LivroMenu";
import { Input } from "./utils/Input";

async function iniciar(): Promise<void> {
  const autorRepository = new AutorRepository();
  const livroRepository = new LivroRepository();
  const emprestimoRepository = new EmprestimoRepository();

  const autorService = new AutorService(autorRepository, livroRepository);
  const livroService = new LivroService(
    livroRepository,
    autorRepository,
    emprestimoRepository,
  );

  const autorMenu = new AutorMenu(new AutorController(autorService));
  const livroMenu = new LivroMenu(new LivroController(livroService));

  let sair = false;
  while (!sair) {
    console.log("\n1 - Autores\n2 - Livros\n0 - Sair");
    const opcao = await Input.perguntar("Escolha: ");
    if (opcao === "1") await autorMenu.exibir();
    else if (opcao === "2") await livroMenu.exibir();
    else if (opcao === "0") sair = true;
    else console.log("\n✖ Opção inválida.");
  }

  Input.fechar();
}

iniciar();
