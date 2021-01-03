import { VsCodeConverter } from '../../../src/Connectors/Converters/VsCodeConverter/VsCodeConverter';
import { UniversalKeymap } from '../../../src/Connectors/Keymap';
import {
  HoldableKeys,
  Shortcut,
  SingleShortcut,
} from '../../../src/Connectors/Shortcut';
import { fsUtils } from '../../../src/Connectors/Utils';
import * as path from 'path';
import { LoadSchema } from '../../../src/Connectors/Schema/SchemaLoader';
import { SchemaTypes } from '../../../src/Connectors/Schema/Schema';

describe('vscode converter test', function () {
  const universalKm: UniversalKeymap = new UniversalKeymap({
    formatDocument: [
      new Shortcut(
        new SingleShortcut(
          new Set<HoldableKeys>(['alt', 'shift']),
          'f'
        ),
        new SingleShortcut(
          new Set<HoldableKeys>(['ctrl']),
          'a'
        )
      ),
      new Shortcut(
        new SingleShortcut(
          new Set<HoldableKeys>(['alt', 'shift']),
          'f'
        ),
        new SingleShortcut(
          new Set<HoldableKeys>(['ctrl']),
          'b'
        )
      ),
    ],
  });

  const mockKeymapFolder = './tests/Converters/VsCodeConverter/mocks';
  const mockKeybindings = path.join(mockKeymapFolder, 'keybindings.json');

  const converter = new VsCodeConverter(mockKeybindings);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Read config', async function () {
    const expectedKm = await LoadSchema(SchemaTypes.VS_CODE);
    expectedKm.overrideKeymap(universalKm)
    const converted: UniversalKeymap = await converter.load();
    expect(converted).toEqual(expectedKm);
  });

  it('Write config', async function () {
    fsUtils.saveJson = jest.fn().mockReturnValue(Promise.resolve());
    const expectedKeymap = await fsUtils.readJson(mockKeybindings);
    await converter.save(universalKm);
    expect(fsUtils.saveJson).toHaveBeenCalledWith(
      mockKeybindings,
      expectedKeymap
    );
  });
});
