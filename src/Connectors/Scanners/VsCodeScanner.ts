import { Ide } from "../Ide";
import { DirectoryScanner } from "./DirectoryScanner";
import { VsCodeConverter } from "../Converters/VsCodeConverter";
import { VS_CODE } from "../Constants/VsCode";

export class VsCodeScanner extends DirectoryScanner {
  static readonly ide: Ide = {
    name: "vscode",
    converter: VsCodeConverter.get(),
  };
  constructor() {
    super(VS_CODE.FOLDER_PATH, VsCodeScanner.ide);
  }
}
