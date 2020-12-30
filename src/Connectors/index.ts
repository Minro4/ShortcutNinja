import { Ide } from "./Ide";
import { AggregateScanner } from "./Scanners/AggregateScanner";

import { ShortcutCreator } from "./Shortcut";

//Connectors Interface
export module Connectors {
  export function scan(): Promise<Ide[]> {
    return new AggregateScanner().scan();
  }
}
export { ShortcutCreator };
