import { Ide, IdeType } from '../Ide';
import { DirectoryScanner } from './DirectoryScanner';
import { VsCodeConverter } from '../Converters/VsCodeConverter/VsCodeConverter';
import { FOLDER_PATH } from '../Constants/VsCode';

export class VsCodeScanner extends DirectoryScanner {
  static readonly ide: Ide = {
    name: 'Visual Studio Code',
    converter: new VsCodeConverter(),
    type: IdeType.VsCode
  };
  constructor() {
    super(FOLDER_PATH, VsCodeScanner.ide);
  }
}
