import { Shortcut } from '../../Shortcut';
import { JbShortcut } from './JetBrains.models';
import { IShortcutConverter, StrShortcutConverter } from '../ShortcutConverter';

export class JetBrainsShortcutConverter
  implements IShortcutConverter<JbShortcut> {
  private strConverter = new StrShortcutConverter(' ', undefined);

  toIde(shortcut: Shortcut): JbShortcut {
    return {
      $: {
        'first-keystroke': this.strConverter.toIdeSingleSc(shortcut.sc1),
        'second-keystroke': shortcut.sc2
          ? this.strConverter.toIdeSingleSc(shortcut.sc2)
          : undefined,
      },
    };
  }
  toUni(shortcut: JbShortcut): Shortcut | undefined {
    const sc1 = this.strConverter.toUniSingleSc(shortcut.$['first-keystroke']);
    if (!sc1) return undefined;

    const sc2 = shortcut.$['second-keystroke']
      ? this.strConverter.toUniSingleSc(shortcut.$['second-keystroke'])
      : undefined;

    return sc1 ? new Shortcut(sc1, sc2) : undefined;
  }
}
