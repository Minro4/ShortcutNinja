import { IShortcutConverter } from '../src/Connectors/Converters/ShortcutConverter';
import { IShortcut } from '../src/Connectors/Shortcut';
import { UniversalKeymap } from '../src/Connectors/UniversalKeymap';

describe('Universal keymap tests', function () {
  const converter: IShortcutConverter<string> = {
    toIde: (shortcut: IShortcut) => {
      if (shortcut.sc1.key === 'uniSc') return 'ideSc';
      return 'wrong';
    },
    toUni: (shortcut: string) => {
      if (shortcut == 'ideSc')
        return { sc1: { key: 'uniSc', holdedKeys: new Set() } };
      return undefined;
    },
  };

  it('toUniKeymap should correctly map key and shortcut', async function () {
    const uni = UniversalKeymap.fromIdeKeymap(
      { ideKey: ['ideSc'] },
      { uniKey: 'ideKey' },
      converter
    );

    expect(uni.keymap.uniKey[0].sc1.key).toEqual('uniSc');
  });

  it('toUniKeymap should correctly map key and shortcut', async function () {
    const uniKm = new UniversalKeymap({
      uniKey: [{ sc1: { key: 'uniSc', holdedKeys: new Set() } }],
    });
    const ideKm = uniKm.toIdeKeymap({ uniKey: 'ideKey' }, converter);

    expect(ideKm.ideKey).toEqual(['ideSc']);
  });
});
