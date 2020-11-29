import { Ide } from "../Ide";
import { VsCodeScanner } from "./VsCodeScanner";

export class Scanner implements IScanner {
  private static readonly defaultSubScanners: IScanner[] = [
    new VsCodeScanner(),
  ];

  private subScanners: IScanner[];
  constructor(subScanners: IScanner[] = Scanner.defaultSubScanners) {
    this.subScanners = subScanners;
  }

  public async scan(): Promise<Ide[]> {
    let ides: Ide[] = [];
    await Promise.all(
      this.subScanners.map(async (scanner) => {
        ides.concat(await scanner.scan());
      })
    );
    return ides;
  }
}

export interface IScanner {
  scan(): Promise<Ide[]>;
}
