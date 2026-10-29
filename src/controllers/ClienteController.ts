import { ClienteService } from "../services/ClienteService";
import { Cliente } from "../models/Cliente";
import { Input } from "../utils/Input";
import { converterParaId } from "../utils/Validacoes";
import { exibirErro } from "../utils/exibirErro";

export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}
  async cadastrar(): Promise<void> {
    try {
      const nome = await Input.perguntar("Nome: ");
      const email = await Input.perguntar("E-mail: ");
      const telefone = await Input.perguntar("Telefone: ");
      const cliente = await this.clienteService.cadastrar(
        nome,
        email,
        telefone,
      );
      console.log(`Cliente cadastrado com ID ${cliente.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async listar(): Promise<void> {
    try {
      const clientes = await this.clienteService.listar();
      if (clientes.length === 0) {
        console.log("Nenhum cliente cadastrado.");
        return;
      }
      console.log("--- Clientes ---");
      clientes.forEach((c) => this.exibirCliente(c));
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async consultar(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do cliente: "));
      const cliente = await this.clienteService.buscarPorId(id);
      console.log();
      this.exibirCliente(cliente);
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async atualizar(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do cliente: "));
      await this.clienteService.buscarPorId(id);
      const nome = await Input.perguntar("Novo nome: ");
      const email = await Input.perguntar("Novo e-mail: ");
      const telefone = await Input.perguntar("Novo telefone: ");
      await this.clienteService.atualizar(id, nome, email, telefone);
      console.log(" Cliente atualizado com sucesso.");
    } catch (erro) {
      exibirErro(erro);
    }
  }
  async remover(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do cliente: "));
      await this.clienteService.remover(id);
      console.log("Cliente removido com sucesso.");
    } catch (erro) {
      exibirErro(erro);
    }
  }
  private exibirCliente(cliente: Cliente): void {
    console.log(
      `[${cliente.id}] ${cliente.nome} | ${cliente.email} | ${cliente.telefone || "sem telefone"}`,
    );
  }
}
