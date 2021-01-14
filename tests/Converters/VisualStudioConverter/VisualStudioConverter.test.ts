import { VsImportExport } from '../../../src/Connectors/Converters/VisualStudioConverter/VsImportExport';
import { UniversalKeymap } from '../../../src/Connectors/Keymap';
import {
  HoldableKeys,
  Shortcut,
  SingleShortcut,
} from '../../../src/Connectors/Shortcut';
import { fsUtils } from '../../../src/Connectors/Utils';
import { SchemaTypes } from '../../../src/Connectors/Schema/SchemaTypes';
import { VisualStudioConverter } from '../../../src/Connectors/Converters/VisualStudioConverter/VisualStudioConverter';
import { VisualStudioXmlConfig } from '../../../src/Connectors/Converters/VisualStudioConverter/VisualStudio.models';

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
          new Set<HoldableKeys>(['ctrl']),
          'b'
        )
      ),
    ],
  });

  const baseKm: UniversalKeymap = new UniversalKeymap({
    formatDocument: [
      new Shortcut(
        new SingleShortcut(
          new Set<HoldableKeys>(['ctrl']),
          'r'
        )
      ),
      new Shortcut(
        new SingleShortcut(
          new Set<HoldableKeys>(['ctrl']),
          'a'
        )
      ),
    ],
  });

  const mocksPath = './tests/Converters/VisualStudioConverter/mocks/';
  const vsSettingsPath = `${mocksPath}vssettings.xml`;
  const vsSettingsEmptyPath = `${mocksPath}vssettingsEmpty.xml`;
  const expectedVsSettingsPath = `${mocksPath}expectedVsSettings.xml`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Read config', async function () {
    const converter = new VisualStudioConverter('allo');
    converter['loadSettings'] = jest
      .fn()
      .mockReturnValue(fsUtils.readXml<VisualStudioXmlConfig>(vsSettingsPath));

    const expectedKm = SchemaTypes.VS_CODE.get();
    expectedKm.addKeymap(baseKm);
    const converted: UniversalKeymap = await converter.load();
    expect(converted).toEqual(expectedKm);
  });

  it('Write config', async function () {
    const converter = new VisualStudioConverter('allo');
    converter['loadSettings'] = jest
      .fn()
      .mockReturnValue(fsUtils.readXml<VisualStudioXmlConfig>(vsSettingsPath));

    let p: string | undefined = undefined;
    VsImportExport.importSettings = jest
      .fn()
      .mockImplementation((_devenv, path) => {
        p = path;
        Promise.resolve();
      });
    await converter.save(universalKm);

    expect(p).toBeDefined();
    const converted = await fsUtils.readXml<VisualStudioXmlConfig>(p!);
    const expected = await fsUtils.readXml<VisualStudioXmlConfig>(
      expectedVsSettingsPath
    );

    const convertedConfig = converter.xmlToConfig(converted);
    const expectedConfig = converter.xmlToConfig(expected);

    expect(convertedConfig.additionalShortcuts).toEqual(
      expectedConfig.additionalShortcuts
    );
    expect(convertedConfig.scheme).toEqual(expectedConfig.scheme);
    const formatDocCommands = convertedConfig.removedShortcuts.filter(
      (sc) => sc.command === 'Edit.FormatDocument'
    );
    expect(formatDocCommands).toEqual(expectedConfig.removedShortcuts);
  });

  it('Write config empty', async function () {
    const converter = new VisualStudioConverter('allo');
    converter['loadSettings'] = jest
      .fn()
      .mockReturnValue(
        fsUtils.readXml<VisualStudioXmlConfig>(vsSettingsEmptyPath)
      );

    let p: string | undefined = undefined;
    VsImportExport.importSettings = jest
      .fn()
      .mockImplementation((_devenv, path) => {
        p = path;
        Promise.resolve();
      });
    await converter.save(universalKm);

    expect(p).toBeDefined();

    const converted = await fsUtils.readXml<VisualStudioXmlConfig>(p!);
    const expected = await fsUtils.readXml<VisualStudioXmlConfig>(
      expectedVsSettingsPath
    );

    const convertedConfig = converter.xmlToConfig(converted);
    const expectedConfig = converter.xmlToConfig(expected);

    expect(convertedConfig.additionalShortcuts).toEqual(
      expectedConfig.additionalShortcuts
    );
    expect(convertedConfig.scheme).toEqual(expectedConfig.scheme);
    convertedConfig.removedShortcuts.forEach((sc) => {
      expect(expectedConfig.removedShortcuts.includes(sc));
    });
  });
});
