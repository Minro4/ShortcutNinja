import { Ide } from "./Ide";
import { AggregateScanner } from "./Scanners/AggregateScanner";

import { ShortcutCreator } from "./Shortcut";

//Connectors Interface
export class Connectors {
  public static scan(): Promise<Ide[]> {
    return new AggregateScanner().scan();
  }
}
export { ShortcutCreator };
