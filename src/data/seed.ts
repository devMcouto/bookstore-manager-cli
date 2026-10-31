import { Autor } from "../models/Autor";
import { Livro } from "../models/Livro";
import { Cliente } from "../models/Cliente";
import { Emprestimo } from "../models/Emprestimo";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";

export interface Repositorios {
  autores: AutorRepository;
  livros: LivroRepository;
  clientes: ClienteRepository;
  emprestimos: EmprestimoRepository;
}

export async function carregarDadosIniciais({
  autores,
  livros,
  clientes,
  emprestimos,
}: Repositorios): Promise<void> {
  await autores.salvar(new Autor(1, "Machado de Assis", "Brasileira"));
  await autores.salvar(new Autor(2, "Clarice Lispector", "Brasileira"));
  await autores.salvar(new Autor(3, "George Orwell", "Britânica"));

  await livros.salvar(new Livro(1, "Dom Casmurro", 1, 1899, 3, 2));
  await livros.salvar(
    new Livro(2, "Memórias Póstumas de Brás Cubas", 1, 1881, 2, 2),
  );
  await livros.salvar(new Livro(3, "A Hora da Estrela", 2, 1977, 2, 1));
  await livros.salvar(new Livro(4, "1984", 3, 1949, 4, 4));

  await clientes.salvar(
    new Cliente(1, "Ana Souza", "ana@email.com", "47 99999-1111"),
  );
  await clientes.salvar(
    new Cliente(2, "Bruno Lima", "bruno@email.com", "47 99999-2222"),
  );
  await clientes.salvar(
    new Cliente(3, "Carla Mendes", "carla@email.com", "47 99999-3333"),
  );

  await emprestimos.salvar(new Emprestimo(1, 1, 1, new Date(2026, 9, 20)));
  await emprestimos.salvar(new Emprestimo(2, 3, 2, new Date(2026, 9, 22)));
  await emprestimos.salvar(
    new Emprestimo(3, 2, 3, new Date(2026, 9, 10), new Date(2026, 9, 17)),
  );
}
