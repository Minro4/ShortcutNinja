import { IShortcutConverter } from '../src/Connectors/Converters/ShortcutConverter';
import { Shortcut, SingleShortcut } from '../src/Connectors/Shortcut';
import { UniversalKeymap } from '../src/Connectors/UniversalKeymap';

describe('Universal keymap tests', function () {
  const converter: IShortcutConverter<string> = {
    toIde: (shortcut: Shortcut) => {
      if (shortcut.sc1.key === 'uniSc') return 'ideSc';
      return 'wrong';
    },
    toUni: (shortcut: string) => {
      if (shortcut == 'ideSc')
        return new Shortcut(new SingleShortcut(new Set(), 'uniSc'));
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
      uniKey: [new Shortcut(new SingleShortcut(new Set(), 'uniSc'))],
    });
    const ideKm = uniKm.toIdeKeymap({ uniKey: 'ideKey' }, converter);

    expect(ideKm.ideKey).toEqual(['ideSc']);
  });
});
