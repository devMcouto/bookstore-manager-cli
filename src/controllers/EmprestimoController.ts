import { EmprestimoService } from "../services/EmprestimosService";
import { EmprestimoDetalhado } from "../models/EmprestimoDetalhado";
import { Input } from "../utils/Input";
import { converterParaId } from "../utils/Validacoes";
import { exibirErro } from "../utils/exibirErro";
import { formatarData } from "../utils/formatacao";

export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  async realizar(): Promise<void> {
    try {
      const livroId = converterParaId(await Input.perguntar("Id do livro: "));
      const clienteId = converterParaId(
        await Input.perguntar("ID do cliente: "),
      );
      const emprestimo = await this.emprestimoService.realizar(
        livroId,
        clienteId,
      );
      console.log(`Empréstimo registrado com ID ${emprestimo.id}.`);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  async devolver(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do empréstimo: "));
      await this.emprestimoService.devolver(id);
      console.log("Devolução registrada com sucesso.");
    } catch (erro) {
      exibirErro(erro);
    }
  }

  async listar(apenasAtivos: boolean): Promise<void> {
    try {
      const emprestimos = await this.emprestimoService.listar(apenasAtivos);
      if (emprestimos.length === 0) {
        console.log("Nenhum empréstimo encontrado.");
        return;
      }
      console.log(
        apenasAtivos ? "--- Empréstimos ativos ---" : "--- Empréstimos ---",
      );
      emprestimos.forEach((item) => this.exibirEmprestimo(item));
    } catch (erro) {
      exibirErro(erro);
    }
  }

  async consultar(): Promise<void> {
    try {
      const id = converterParaId(await Input.perguntar("ID do empréstimo: "));
      const item = await this.emprestimoService.buscarDetalhadoPorId(id);
      console.log();
      this.exibirEmprestimo(item);
    } catch (erro) {
      exibirErro(erro);
    }
  }

  private exibirEmprestimo({
    emprestimo,
    tituloLivro,
    nomeCliente,
  }: EmprestimoDetalhado): void {
    const situacao = emprestimo.dataDevolucao
      ? `Devolvido em ${formatarData(emprestimo.dataDevolucao)}`
      : "ATIVO";
    console.log(
      `[${emprestimo.id}] "${tituloLivro}" | Cliente: ${nomeCliente} | ` +
        `Emprestado em ${formatarData(emprestimo.dataEmprestimo)} | ${situacao}`,
    );
  }
}
