import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { AutorService } from "./services/AutorService";
import { AutorController } from "./controllers/AutorController";
import { AutorMenu } from "./menus/AutorMenu";
import { Input } from "./utils/Input";

async function iniciar(): Promise<void> {
  const autorRepository = new AutorRepository();
  const livroRepository = new LivroRepository();

  const autorService = new AutorService(autorRepository, livroRepository);
  const autorController = new AutorController(autorService);
  const autorMenu = new AutorMenu(autorController);

  await autorMenu.exibir();
  Input.fechar();
}

iniciar();
