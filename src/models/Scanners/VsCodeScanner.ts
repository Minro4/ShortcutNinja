import { Ide } from "../Ide";
import { DirectoryScanner } from "./DirectoryScanner";
import { homedir } from "os";
import * as path from "path";
import { VsCodeConverter } from "../Converters/VsCodeConverter";

export class VsCodeScanner extends DirectoryScanner {
  static readonly path = path.join(homedir(), "/Appdata/Roaming/Code");
  static readonly ide: Ide = {
    name: "vscode",
    converter: new VsCodeConverter(),
  };
  constructor() {
    super(VsCodeScanner.path, VsCodeScanner.ide);
  }
}
