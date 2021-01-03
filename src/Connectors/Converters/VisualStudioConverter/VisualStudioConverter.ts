import { UniversalKeymap } from '../../Keymap';
import { Converter } from '../Converter';
import { StrShortcutConverter } from '../ShortcutConverter';

import * as chokidar from 'chokidar';
import { fsUtils } from '../../Utils';
import {
  UserShortcuts,
  VisualStudioConfig,
  VsShortcut,
  VisualStudioXmlConfig,
  VisualStudioXmlKeyboardShortcuts,
} from './VisualStudio.models';
import { exportSettings, importSettings } from './VsImportExport';
import { Schema, SchemaTypes } from '../../Schema/Schema';
import { LoadSchema } from '../../Schema/SchemaLoader';
import { Keymap } from '../../Keymap/Keymap';

export class VisualStudioConverter extends Converter<VsShortcut> {

  private devenPath: string;

  constructor(devenPath: string) {
    super(
      'VisualStudio.json',
      new StrShortcutConverter('+', ', ')
    );
    this.devenPath = devenPath;
  }

  public async load(): Promise<UniversalKeymap> {
    const xml = await this.loadSettings(this.devenPath);
    const config = this.xmlToConfig(xml);

    const schema = await LoadSchema(VisualStudioConverter.mapSchema(config.scheme));

    const ideKeymap = config.userShortcuts.reduce((km, sc) => {
      km.add(sc.command,sc.keybind);
      return km;
    }, new Keymap<VsShortcut>());

    schema.overrideKeymap(await this.fromIdeKeymap(ideKeymap));
    return schema;
  }
  public async save(keymap: UniversalKeymap): Promise<any> {
    const ideKeymap = await this.toIdeKeymap(keymap)
    const xml = await this.loadSettings(this.devenPath);

    if (this.addKmToXml(xml, ideKeymap)) {
      const fileName = `temp/imported${new Date().getTime()}`;
      await fsUtils.saveXml(fileName, xml);
      importSettings(this.devenPath, fileName);
    }
  }

  private xmlToConfig(xml: VisualStudioXmlConfig): VisualStudioConfig {
    const sc:
      | VisualStudioXmlKeyboardShortcuts
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === 'Environment_Group'
    )?.Category?.find((element) => element.$.name === 'Environment_KeyBindings')
      ?.KeyboardShortcuts[0];

    if (sc) {
      return {
        scheme: sc.ShortcutsScheme[0],
        userShortcuts:
          sc.UserShortcuts[0]?.Shortcut?.map((sc) => {
            return {
              keybind: sc._,
              command: sc.$.Command,
            };
          }) ?? [],
      };
    } else {
      return {
        scheme: 'Visual Studio',
        userShortcuts: [],
      };
    }
  }

  private addKmToXml(
    xml: VisualStudioXmlConfig,
    ideKeymap: Keymap<VsShortcut>
  ): VisualStudioXmlConfig | undefined {
    const userShortcuts:
      | UserShortcuts[]
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === 'Environment_Group'
    )?.Category?.find((element) => element.$.name === 'Environment_KeyBindings')
      ?.KeyboardShortcuts[0]?.UserShortcuts;

    if (!userShortcuts) return undefined;

    userShortcuts[0] = userShortcuts[0] ?? {};
    const sc = userShortcuts[0];
    sc.Shortcut = sc.Shortcut ?? [];
    sc.RemoveShortcut = sc.RemoveShortcut ?? [];

    Object.keys(ideKeymap).forEach((key) => {
      //Remove old shortcuts TODO test
      sc.RemoveShortcut = sc.RemoveShortcut!.concat(
        sc.Shortcut!.filter((s) => s.$.Command === key)
      );
      sc.Shortcut = sc.Shortcut!.filter((s) => s.$.Command !== key);

      //Add new shortcuts
      sc.Shortcut = ideKeymap.keys().reduce((userShortcut, kmValue) => {
        userShortcut.push({
          $: {
            Command: key,
            Scope: 'Global',
          },
          _: kmValue,
        });
        return userShortcut;
      }, sc.Shortcut);
    });
    return xml;
  }

  private loadSettings(
    devenPath: string,
    settingsPath = `temp/exported${new Date().getTime()}`
  ): Promise<VisualStudioXmlConfig> {
    return new Promise((resolve) => {
      const watcher = chokidar.watch(`${settingsPath}.*`, { interval: 0.5 });
      watcher.on('add', (path) => {
        resolve(fsUtils.readXml<VisualStudioXmlConfig>(path));
        watcher.close();
      });
      exportSettings(devenPath, settingsPath);
    });
  }

  private static mapSchema(schema: string): Schema {
    const map: { [key: string]: Schema } = {
      'Visual Studio Code': SchemaTypes.VS_CODE,
    };
    return map[schema] ?? SchemaTypes.VISUAL_STUDIO;
  }
}
