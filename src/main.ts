import { Autor } from "./models/Autor";
import { AutorRepository } from "./repositories/AutorRepository";

async function testar(): Promise<void> {
  const repo = new AutorRepository();
  const id = await repo.proximoId();
  await repo.salvar(new Autor(id, "Machado de Assis", "Brasileira"));
  console.log(await repo.listar());
}

testar();
