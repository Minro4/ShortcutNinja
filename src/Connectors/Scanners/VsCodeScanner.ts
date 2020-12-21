import { Ide } from "../Ide";
import { DirectoryScanner } from "./DirectoryScanner";
import { VsCodeConverter } from "../Converters/VsCodeConverter";
import { vsCodeFolderPath } from "../Constants/paths";

export class VsCodeScanner extends DirectoryScanner {
  static readonly ide: Ide = {
    name: "vscode",
    converter: VsCodeConverter.get(),
  };
  constructor() {
    super(vsCodeFolderPath, VsCodeScanner.ide);
  }
}
