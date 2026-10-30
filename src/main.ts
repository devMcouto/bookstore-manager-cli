import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { ClienteRepository } from "./repositories/ClienteRepository";
import { EmprestimoRepository } from "./repositories/EmprestimoRepository";
import { AutorService } from "./services/AutorService";
import { LivroService } from "./services/LivroService";
import { ClienteService } from "./services/ClienteService";
import { EmprestimoService } from "./services/EmprestimosService";
import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { ClienteController } from "./controllers/ClienteController";
import { EmprestimoController } from "./controllers/EmprestimoController";
import { AutorMenu } from "./menus/AutorMenu";
import { LivroMenu } from "./menus/LivroMenu";
import { ClienteMenu } from "./menus/ClienteMenu";
import { EmprestimoMenu } from "./menus/EmprestimoMenu";
import { Input } from "./utils/Input";

async function iniciar(): Promise<void> {
  const autorRepository = new AutorRepository();
  const livroRepository = new LivroRepository();
  const clienteRepository = new ClienteRepository();
  const emprestimoRepository = new EmprestimoRepository();

  const autorService = new AutorService(autorRepository, livroRepository);
  const livroService = new LivroService(
    livroRepository,
    autorRepository,
    emprestimoRepository,
  );
  const clienteService = new ClienteService(
    clienteRepository,
    emprestimoRepository,
  );
  const emprestimoService = new EmprestimoService(
    emprestimoRepository,
    livroRepository,
    clienteRepository,
  );

  const autorMenu = new AutorMenu(new AutorController(autorService));
  const livroMenu = new LivroMenu(new LivroController(livroService));
  const clienteMenu = new ClienteMenu(new ClienteController(clienteService));
  const emprestimoMenu = new EmprestimoMenu(
    new EmprestimoController(emprestimoService),
  );

  let sair = false;
  while (!sair) {
    console.log(
      "\n1 - Autores\n2 - Livros\n3 - Clientes\n4 - Empréstimos\n0 - Sair",
    );
    const opcao = await Input.perguntar("Escolha: ");
    if (opcao === "1") await autorMenu.exibir();
    else if (opcao === "2") await livroMenu.exibir();
    else if (opcao === "3") await clienteMenu.exibir();
    else if (opcao === "4") await emprestimoMenu.exibir();
    else if (opcao === "0") sair = true;
    else console.log("Opção inválida.");
  }

  Input.fechar();
}

iniciar();
