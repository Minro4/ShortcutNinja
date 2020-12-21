import { Ide } from "./Ide";
import { Scanner } from "./Scanners/Scanner";
import { ShortcutCreator } from "./Shortcut";

//Connectors Interface
export module Connectors {
  export function scan(): Promise<Ide[]> {
    return new Scanner().scan();
  }
}
export { ShortcutCreator };
