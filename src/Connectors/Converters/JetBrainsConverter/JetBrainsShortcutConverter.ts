import { IShortcut } from "../../Shortcut";
import { JetBrainsShortcut } from "./JetBrains.models";
import { IShortcutConverter, StrShortcutConverter } from "../ShortcutConverter";

export class JetBrainsShortcutConverter
  implements IShortcutConverter<JetBrainsShortcut> {
  private strConverter = new StrShortcutConverter(" ", undefined);

  toIde(shortcut: IShortcut): JetBrainsShortcut {
    return {
      $: {
        "first-keystroke": this.strConverter.toIdeSingleSc(shortcut.sc1),
        "second-keystroke": shortcut.sc2
          ? this.strConverter.toIdeSingleSc(shortcut.sc2)
          : undefined,
      },
    };
  }
  toUni(shortcut: JetBrainsShortcut): IShortcut | undefined {
    const sc1 = this.strConverter.toUniSingleSc(shortcut.$["first-keystroke"]);
    return sc1
      ? {
          sc1: sc1,
          sc2: shortcut.$["second-keystroke"]
            ? this.strConverter.toUniSingleSc(shortcut.$["second-keystroke"])
            : undefined,
        }
      : undefined;
  }
}
