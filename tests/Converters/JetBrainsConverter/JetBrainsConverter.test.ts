import { JetBrainsConverter } from '../../../src/Connectors/Converters/JetbrainsConverter/JetBrainsConverter';
import { UniversalKeymap } from '../../../src/Connectors/UniversalKeymap';
import { HoldableKeys } from '../../../src/Connectors/Shortcut';
import { fsUtils } from '../../../src/Connectors/Utils';
import * as path from 'path';
import { APP_NAME } from '../../../src/Connectors/Constants/general';
import * as JB from '../../../src/Connectors/Constants/JetBrains';
import {
  JbKeymapOptions,
  JbXmlConfig,
} from '../../../src/Connectors/Converters/JetbrainsConverter/JetBrains.models';
import { LoadSchema } from '../../../src/Connectors/Schema/SchemaLoader';
import { SchemaTypes } from '../../../src/Connectors/Schema/Schema';

describe('JetBrains converter test', function () {
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

  const mockKeymapFolder = './tests/Converters/JetBrainsConverter/mocks';
  const keymapOptionPath = path.join(mockKeymapFolder, 'keymap.xml');
  const keymapOptionSchemaTestPath = path.join(
    mockKeymapFolder,
    'keymapSchemaTest.xml'
  );
  const mockKeymap = path.join(mockKeymapFolder, 'TestKeymap.xml');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Read config', async function () {
    const baseKm = await LoadSchema(SchemaTypes.VISUAL_STUDIO);
    const expectedKm: UniversalKeymap = baseKm.overrideKeymap(universalKm);

    const converter = new JetBrainsConverter(
      keymapOptionPath,
      mockKeymapFolder
    );

    const converted: UniversalKeymap = await converter.load();
    expect(converted).toEqual(expectedKm);
  });

  it('Write config', async function () {
    const converter = new JetBrainsConverter(
      keymapOptionPath,
      mockKeymapFolder
    );

    const expectedPath =
      path.join(mockKeymapFolder, APP_NAME) + `.${JB.CONFIG_EXTENTION}`;

    const expectedKeymap = await fsUtils.readXml<JbXmlConfig>(mockKeymap);
    const expectedOptions = await fsUtils.readXml<JbKeymapOptions>(
      keymapOptionPath
    );
    expectedOptions.application.component[0].active_keymap[0].$.name = APP_NAME;

    fsUtils.saveXml = jest.fn().mockReturnValue(Promise.resolve());
    await converter.save(universalKm);

    expect(fsUtils.saveXml).toHaveBeenCalledWith(
      keymapOptionPath,
      expectedOptions
    );
    expect(fsUtils.saveXml).toHaveBeenCalledWith(expectedPath, expectedKeymap);
  });

  it('Read config Schema', async function () {
    const expectedKm = await LoadSchema(SchemaTypes.SUBLIME);

    const converter = new JetBrainsConverter(
      keymapOptionSchemaTestPath,
      mockKeymapFolder
    );

    const converted: UniversalKeymap = await converter.load();
    expect(converted).toEqual(expectedKm);
  });
});
