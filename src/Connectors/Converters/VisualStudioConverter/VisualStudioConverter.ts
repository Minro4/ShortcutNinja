import { UniversalKeymap } from '../../Keymap';
import { Converter } from '../Converter';
import { StrShortcutConverter } from '../ShortcutConverter';

import * as chokidar from 'chokidar';
import { fsUtils } from '../../Utils';
import {
  XmlUserShortcuts,
  VisualStudioConfig,
  VsShortcut,
  VisualStudioXmlConfig,
  VisualStudioXmlKeyboardShortcuts,
  VisualStudioConfigShortcut,
  XmlVisualStudioConfigShortcut,
} from './VisualStudio.models';
import { Schema } from '../../Schema/Schema';
import { SchemaTypes } from '../../Schema/SchemaTypes';
import { Keymap } from '../../Keymap/Keymap';
import { VsImportExport } from './VsImportExport';
import { IdeMappings } from '../../IdeMappings';
import * as path from 'path';
import { APP_FOLDER } from '../../Constants/general';

export class VisualStudioConverter extends Converter<VsShortcut> {
  private devenPath: string;
  private tempPath = path.join(APP_FOLDER, 'temp');

  constructor(devenPath: string) {
    super(IdeMappings.VISUAL_STUDIO, new StrShortcutConverter('+', ', '));
    this.devenPath = devenPath;
  }

  public async load(): Promise<UniversalKeymap> {
    const xml = await this.loadSettings(this.devenPath);
    const config = this.xmlToConfig(xml);

    const schema = VisualStudioConverter.mapSchema(config.scheme).get();

    const uniKmAdditional = await this.configScToUniKm(
      config.additionalShortcuts
    );
    const uniKmRemoved = await this.configScToUniKm(config.removedShortcuts);

    schema.removeKeymap(uniKmRemoved);
    schema.addKeymap(uniKmAdditional);
    return schema;
  }

  public async save(keymap: UniversalKeymap): Promise<boolean> {
    const xml = await this.loadSettings(this.devenPath);

    if (await this.addKmToXml(xml, keymap)) {
      const fileName = path.join(
        this.tempPath,
        `imported${new Date().getTime()}`
      );
      await fsUtils.saveXml(fileName, xml);
      VsImportExport.importSettings(this.devenPath, fileName);
      return true;
    }

    return false;
  }

  public xmlToConfig(xml: VisualStudioXmlConfig): VisualStudioConfig {
    const sc:
      | VisualStudioXmlKeyboardShortcuts
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === 'Environment_Group'
    )?.Category?.find((element) => element.$.name === 'Environment_KeyBindings')
      ?.KeyboardShortcuts[0];

    function xmlScToConfigSc(
      xmlSc?: XmlVisualStudioConfigShortcut[]
    ): VisualStudioConfigShortcut {
      return (
        xmlSc?.map((sc) => ({
          keybind: sc._,
          command: sc.$.Command,
        })) ?? []
      );
    }

    if (sc) {
      return {
        scheme: sc.ShortcutsScheme[0],
        additionalShortcuts: xmlScToConfigSc(sc.UserShortcuts[0].Shortcut),
        removedShortcuts: xmlScToConfigSc(sc.UserShortcuts[0].RemoveShortcut),
      };
    } else {
      return {
        scheme: 'Visual Studio',
        additionalShortcuts: [],
        removedShortcuts: [],
      };
    }
  }

  private async addKmToXml(
    xml: VisualStudioXmlConfig,
    uniKeymap: UniversalKeymap
  ): Promise<VisualStudioXmlConfig | undefined> {
    function mapToXml(
      key: string,
      value: string
    ): XmlVisualStudioConfigShortcut {
      return {
        $: {
          Command: key,
          Scope: 'Global',
        },
        _: value,
      };
    }

    const xmlSc:
      | VisualStudioXmlKeyboardShortcuts
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === 'Environment_Group'
    )?.Category?.find((element) => element.$.name === 'Environment_KeyBindings')
      ?.KeyboardShortcuts[0];

    if (!xmlSc) return undefined;

    if (!xmlSc.UserShortcuts[0] || xmlSc.UserShortcuts[0] == '') {
      xmlSc.UserShortcuts = [{}];
    }

    const userShortcuts: XmlUserShortcuts[] = xmlSc.UserShortcuts;

    const sc =
      userShortcuts[0] && userShortcuts[0] != '' ? userShortcuts[0] : {};
    sc.Shortcut = sc.Shortcut ?? [];
    sc.RemoveShortcut = sc.RemoveShortcut ?? [];

    const schemaName = xmlSc.ShortcutsScheme[0];
    const uniSchema = VisualStudioConverter.mapSchema(schemaName).get();
    uniKeymap.removeSharedMappings(uniSchema);

    const ideKeymap = await this.toIdeKeymap(uniKeymap);
    const schema = await this.toIdeKeymap(uniSchema);

    ideKeymap.keys().forEach((key) => {
      //Remove old shortcuts TODO test
      sc.RemoveShortcut?.push(
        ...sc.Shortcut!.filter((s) => s.$.Command === key)
      );

      sc.Shortcut = sc.Shortcut!.filter((s) => s.$.Command !== key);

      //Add new shortcuts
      sc.Shortcut = ideKeymap.get(key).reduce((userShortcut, kmValue) => {
        userShortcut.push(mapToXml(key, kmValue));
        return userShortcut;
      }, sc.Shortcut);
    });

    //Remove schema shortcuts
    sc.RemoveShortcut.push(
      ...schema.keys().flatMap((key) => {
        return schema.get(key).map((kmValue) => mapToXml(key, kmValue));
      })
    );

    return xml;
  }

  private loadSettings(
    devenPath: string,
    settingsPath = path.join(this.tempPath, `exported${new Date().getTime()}`)
  ): Promise<VisualStudioXmlConfig> {
    return new Promise((resolve) => {
      const watcher = chokidar.watch(`${settingsPath}.*`, { interval: 0.5 });
      watcher.on('add', (path) => {
        resolve(fsUtils.readXml<VisualStudioXmlConfig>(path));
        watcher.close();
      });
      VsImportExport.exportSettings(devenPath, settingsPath);
    });
  }

  private configScToUniKm(
    configSc: VisualStudioConfigShortcut
  ): Promise<UniversalKeymap> {
    const ideKm = configSc.reduce((km, sc) => {
      km.add(sc.command, sc.keybind);
      return km;
    }, new Keymap<VsShortcut>());

    return this.fromIdeKeymap(ideKm);
  }

  private static mapSchema(schema: string): Schema {
    const map: { [key: string]: Schema } = {
      'Visual Studio Code': SchemaTypes.VS_CODE,
    };
    return map[schema] ?? SchemaTypes.VISUAL_STUDIO;
  }
}
