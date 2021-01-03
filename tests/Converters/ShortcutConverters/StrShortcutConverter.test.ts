import { StrShortcutConverter } from '../../../src/Connectors/Converters/ShortcutConverter';
import {
  HoldableKeys,
  Shortcut,
  SingleShortcut,
} from '../../../src/Connectors/Shortcut';

describe('StrShortcutConverter test', function () {
  const converter = new StrShortcutConverter();
  let uniSingle: Shortcut;
  let uniChorded: Shortcut;
  const ideSingle = 'shift+alt+a';
  const ideChorded = 'shift+alt+a ctrl+alt+b';

  beforeEach(() => {
    uniSingle = new Shortcut(
      new SingleShortcut(
        new Set<HoldableKeys>(['alt', 'shift']),
        'a'
      )
    );

    uniChorded = new Shortcut(
      new SingleShortcut(
        new Set<HoldableKeys>(['alt', 'shift']),
        'a'
      ),
      new SingleShortcut(
        new Set<HoldableKeys>(['alt', 'ctrl']),
        'b'
      )
    );
  });

  it('ToIde single shortcut', async function () {
    const ideSc = converter.toIde(uniSingle);
    expect(ideSc).toEqual(ideSingle);
  });

  it('ToIde chorded shortcut', async function () {
    const ideSc = converter.toIde(uniChorded);
    expect(ideSc).toEqual(ideChorded);
  });

  it('ToUni single shortcut', async function () {
    const uniSc = converter.toUni(ideSingle);
    expect(uniSc).toEqual(uniSingle);
  });

  it('ToUni chorded shortcut', async function () {
    const uniSc = converter.toUni(ideChorded);
    expect(uniSc).toEqual(uniChorded);
  });
});
