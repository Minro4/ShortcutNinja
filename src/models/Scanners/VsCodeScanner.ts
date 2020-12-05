import { Ide } from "../Ide";
import { DirectoryScanner } from "./DirectoryScanner";
import { VsCodeConverter } from "../Converters/VsCodeConverter";
import { folderPath } from "../Constants/VsCodeConstants";

export class VsCodeScanner extends DirectoryScanner {
  static readonly ide: Ide = {
    name: "vscode",
    converter: VsCodeConverter.get(),
  };
  constructor() {
    super(folderPath, VsCodeScanner.ide);
  }
}
