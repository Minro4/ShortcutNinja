import { Ide } from "../Ide";
import { VisualStudioScanner } from "./VisualStudioScanner";
import { VsCodeScanner } from "./VsCodeScanner";

export class Scanner implements IScanner {
  private static readonly defaultSubScanners: IScanner[] = [
    new VsCodeScanner(),
    new VisualStudioScanner(),
  ];

  private subScanners: IScanner[];
  constructor(subScanners: IScanner[] = Scanner.defaultSubScanners) {
    this.subScanners = subScanners;
  }

  public async scan(): Promise<Ide[]> {
    return (
      await Promise.all(this.subScanners.map(async (scanner) => scanner.scan()))
    ).reduce<Ide[]>((ides, subIdes) => ides.concat(subIdes), []);
  }
}

export interface IScanner {
  scan(): Promise<Ide[]>;
}
