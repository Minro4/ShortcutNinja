import { Ide } from "../Ide";
import { IScanner } from "./IScanner";
import { glob } from "glob";
import { VisualStudioConverter } from "../Converters/VisualStudioConverter/VisualStudioConverter";
import { VISUAL_STUDIO } from "../Constants/VisualStudio";

export class VisualStudioScanner implements IScanner {
  async scan(): Promise<Ide[]> {
    return glob
      .sync(`/${VISUAL_STUDIO.FOLDER_PATH}/*/*/${VISUAL_STUDIO.DEV_ENV}`)
      .map<Ide>((p) => {
        const folders = p.split("/");
        return {
          name: `Visual Studio ${folders[3]} ${folders[4]}`,
          converter: new VisualStudioConverter(p),
        };
      });
  }
}
