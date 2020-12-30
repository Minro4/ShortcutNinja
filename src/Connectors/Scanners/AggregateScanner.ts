import { IScanner } from "./IScanner";
import { JetBrainsScanner } from "./JetBrainsScanner";
import { VisualStudioScanner } from "./VisualStudioScanner";
import { VsCodeScanner } from "./VsCodeScanner";
import { Ide } from "../Ide";

export class AggregateScanner implements IScanner {
  private static readonly defaultSubScanners: IScanner[] = [
    new VsCodeScanner(),
    new VisualStudioScanner(),
    new JetBrainsScanner(),
  ];

  private subScanners: IScanner[];
  constructor(subScanners: IScanner[] = AggregateScanner.defaultSubScanners) {
    this.subScanners = subScanners;
  }

  public async scan(): Promise<Ide[]> {
    return (
      await Promise.all(this.subScanners.map(async (scanner) => scanner.scan()))
    ).reduce<Ide[]>((ides, subIdes) => ides.concat(subIdes), []);
  }
}
