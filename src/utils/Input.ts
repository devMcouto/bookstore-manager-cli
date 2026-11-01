import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

export class Input {
  private static readonly rl = readline.createInterface({ input, output });

  static async perguntar(texto: string): Promise<string> {
    const resposta = await Input.rl.question(texto);
    return resposta.trim();
  }

  static fechar(): void {
    Input.rl.close();
  }
}
