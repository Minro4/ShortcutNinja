import { Ide } from "../Ide";
import { IScanner } from "./Scanner";

export class VsCodeScanner implements IScanner {
  public async scan(): Promise<Ide[]> {
    throw new Error("Method not implemented.");
  }
}
