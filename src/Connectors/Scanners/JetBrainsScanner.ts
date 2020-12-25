import glob = require("glob");
import {
  jetBrainsFolderPath,
  jetBrainsIdes,
  jetBrainsKeymapsFolder,
} from "../Constants/paths";
import { JetBrainsConverter } from "../Converters/JetbrainsConverter/JetBrainsConverter";
import { Ide } from "../Ide";
import { IScanner } from "./Scanner";

export class JetBrainsScanner implements IScanner {
  async scan(): Promise<Ide[]> {
    console.log("allo");
    const ides =
      jetBrainsIdes
        .reduce((str, ide) => {
          str += `${ide},`;
          return str;
        }, "{")
        .slice(0, -1) + "}";

    const globStr = `${jetBrainsFolderPath}/${ides}*`;

    return glob.sync(globStr).map<Ide>((p) => {
      const folders = p.split("/");
      return {
        name: `JetBrains ${folders[folders.length - 1]}`,
        converter: new JetBrainsConverter(`${p}/${jetBrainsKeymapsFolder}`),
      };
    });
  }
}
