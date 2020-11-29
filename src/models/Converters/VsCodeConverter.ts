import { IUniversalKeymap } from "../IUniversalKeymap";
import { Converter } from "./Converter";

export class VsCodeConverter extends Converter {
  constructor() {
    super(
      "C:/Users/William/AppData/Roaming/Code/User",
      "src/config/ideMappings/vscode.json"
    );
  }

  protected convertTo(keymap: IUniversalKeymap): Promise<string> {
    throw new Error("Method not implemented.");
  }
  protected convertFrom(data: string): IUniversalKeymap {
    throw new Error("Method not implemented.");
  }
}
