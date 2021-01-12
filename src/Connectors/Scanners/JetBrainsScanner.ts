import glob from 'glob';
import * as JB from '../Constants/JetBrains';
import * as path from 'path';
import { JetBrainsConverter } from '../Converters/JetbrainsConverter/JetBrainsConverter';
import { Ide, IdeType } from '../Ide';
import { IScanner } from './IScanner';

export class JetBrainsScanner implements IScanner {
  async scan(): Promise<Ide[]> {
    const globStr = `${JB.FOLDER_PATH}/*/${JB.KEYMAP_OPTION_PATH}`;

    return glob.sync(globStr).map<Ide>((optionsPath) => {
      const folders = optionsPath.split('/');
      const ideName = folders[folders.length - 3];
      const configFolder = path.join(
        JB.FOLDER_PATH,
        ideName,
        JB.KEYMAPS_FOLDER_NAME
      );
      return {
        name: this.formatIdeName(ideName),
        converter: new JetBrainsConverter(optionsPath, configFolder),
        type: IdeType.Jetbrains,
      };
    });
  }

  private formatIdeName(fileName: string): string {
    const idx = fileName.indexOf('20');
    const ideName = fileName.slice(0, idx) + ' ' + fileName.slice(idx);
    return `JetBrains ${ideName}`;
  }
}
