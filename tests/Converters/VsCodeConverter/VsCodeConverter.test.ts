import { VsCodeConverter } from '../../../src/Connectors/Converters/VsCodeConverter/VsCodeConverter';
import { UniversalKeymap } from '../../../src/Connectors/UniversalKeymap';
import { HoldableKeys } from '../../../src/Connectors/Shortcut';
import { fsUtils } from '../../../src/Connectors/Utils';
import * as path from 'path';
import { LoadSchema } from '../../../src/Connectors/Schema/SchemaLoader';
import { SchemaTypes } from '../../../src/Connectors/Schema/Schema';

describe('vscode converter test', function () {
  const universalKm: UniversalKeymap = new UniversalKeymap({
    formatDocument: [
      {
        sc1: {
          key: 'f',
          holdedKeys: new Set<HoldableKeys>(['alt', 'shift']),
        },
        sc2: {
          key: 'a',
          holdedKeys: new Set<HoldableKeys>(['ctrl']),
        },
      },
    ],
  });

  const mockKeymapFolder = './tests/Converters/VsCodeConverter/mocks';
  const mockKeybindings = path.join(mockKeymapFolder, 'keybindings.json');

  const converter = new VsCodeConverter(mockKeybindings);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Read config', async function () {
    const baseKm = await LoadSchema(SchemaTypes.VS_CODE);
    const expectedKm: UniversalKeymap = baseKm.overrideKeymap(universalKm);
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
