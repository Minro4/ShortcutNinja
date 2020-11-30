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
    let scanned = await Promise.all(
      this.subScanners.map(async (scanner) => await scanner.scan())
    );
    return scanned.reduce<Ide[]>((ides, subIdes) => ides.concat(subIdes), []);
  }
}

export interface IScanner {
  scan(): Promise<Ide[]>;
}
