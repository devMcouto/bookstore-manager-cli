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
import { MenuPrincipal } from "./menus/MenuPrincipal";
import { carregarDadosIniciais } from "./data/seed";
import { Input } from "./utils/Input";

async function iniciar(): Promise<void> {
  const autorRepository = new AutorRepository();
  const livroRepository = new LivroRepository();
  const clienteRepository = new ClienteRepository();
  const emprestimoRepository = new EmprestimoRepository();

  await carregarDadosIniciais({
    autores: autorRepository,
    livros: livroRepository,
    clientes: clienteRepository,
    emprestimos: emprestimoRepository,
  });

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

  const menuPrincipal = new MenuPrincipal(
    new AutorMenu(new AutorController(autorService)),
    new LivroMenu(new LivroController(livroService)),
    new ClienteMenu(new ClienteController(clienteService)),
    new EmprestimoMenu(new EmprestimoController(emprestimoService)),
  );

  try {
    await menuPrincipal.exibir();
  } finally {
    Input.fechar();
  }
}

iniciar().catch((erro) => {
  console.error("Erro fatal ao iniciar a aplicação:", erro);
  process.exit(1);
});
