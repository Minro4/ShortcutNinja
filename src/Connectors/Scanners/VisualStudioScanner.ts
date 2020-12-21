import { Ide } from "../Ide";
import { visualStudiodevenv, visualStudioFolderPath } from "../Constants/paths";
import { IScanner } from "./Scanner";
import { glob } from "glob";
import { VisualStudioConverter } from "../Converters/VisualStudioConverter/VisualStudioConverter";

export class VisualStudioScanner implements IScanner {
  async scan(): Promise<Ide[]> {
    //TODO fix this glob
    return glob
      .sync(`C:/${visualStudioFolderPath}/*/*/${visualStudiodevenv}`)
      .map<Ide>((p) => {
        console.log(p);
        const folders = p.split("/");
        return {
          name: `Visual Studio ${folders[3]} ${folders[4]}`,
          converter: new VisualStudioConverter(p),
        };
      });
  }
}
