import { JetBrainsShortcutConverter } from './JetBrainsShortcutConverter';
import {
  JbKeymapOptions,
  JbOptionsComponent,
  JbShortcut,
  JbXmlConfig,
} from './JetBrains.models';
import { Converter } from '../Converter';
import { fsUtils } from '../../Utils';
import * as path from 'path';
import { APP_NAME } from '../../Constants/general';
import { Schema, SchemaTypes } from '../../Schema/Schema';
import * as JB from '../../Constants/JetBrains';
import { UniversalKeymap } from '../../Keymap';
import { LoadSchema } from '../../Schema/SchemaLoader';
import { Keymap } from '../../Keymap';

export class JetBrainsConverter extends Converter<JbShortcut> {
  private optionsPath: string;
  private configFolder: string;

  constructor(optionsPath: string, configFolder: string) {
    super('JetBrains.json', new JetBrainsShortcutConverter());
    this.optionsPath = optionsPath;
    this.configFolder = configFolder;
  }

  public async load(): Promise<UniversalKeymap> {
    const config = await this.fetchConfig();
    const schema = await LoadSchema(
      JetBrainsConverter.mapSchema(config.keymap.$.parent)
    );

    const ideKeymap = config.keymap.action.reduce<Keymap<JbShortcut>>(
      (keymap, action) => {
        if (action['keyboard-shortcut'])
          keymap.add(action.$.id, action['keyboard-shortcut']);
        return keymap;
      },
      new Keymap<JbShortcut>()
    );

    const uniKeymap = await this.fromIdeKeymap(ideKeymap);
    schema.overrideKeymap(uniKeymap);
    return schema;
  }

  public async save(keymap: UniversalKeymap): Promise<any> {
    //Read config and override it
    const currentConfig = await this.fetchConfig();

    const ideKeymap = await this.toIdeKeymap(keymap);

    const newConfig = ideKeymap.keys().reduce((config, keymapKey) => {
      const action = config.keymap.action.find(
        (action) => action.$.id == keymapKey
      );
      if (action) {
        action['keyboard-shortcut'] = ideKeymap.get(keymapKey);
      } else {
        config.keymap.action.push({
          $: { id: keymapKey },
          'keyboard-shortcut': ideKeymap.get(keymapKey),
        });
      }
      return config;
    }, currentConfig);

    newConfig.keymap.$.name = APP_NAME;

    const newPath =
      path.join(this.configFolder, APP_NAME) + `.${JB.CONFIG_EXTENTION}`;

    return Promise.all([
      fsUtils.saveXml<JbXmlConfig>(newPath, newConfig),
      this.setActiveKeymap(APP_NAME),
    ]);
  }

  private async fetchConfig(): Promise<JbXmlConfig> {
    const configName = await this.fetchConfigName();
    const configPath =
      path.join(this.configFolder, configName) + `.${JB.CONFIG_EXTENTION}`;
    try {
      return await fsUtils.readXml<JbXmlConfig>(configPath);
    } catch (err) {
      return this.defaultConfig(configName);
    }
  }

  private async fetchConfigName(): Promise<string> {
    const options = await fsUtils.readXml<JbKeymapOptions>(this.optionsPath);
    const component = options.application.component.find(
      (component) => component.$.name === JB.KEYMAP_MANAGER
    );
    if (component && component.active_keymap[0]) {
      return component.active_keymap[0].$.name;
    }

    throw Error(`Error while fetching keymap options (${this.optionsPath})`);
  }

  private async setActiveKeymap(kmName: string): Promise<void> {
    const options = await fsUtils.readXml<JbKeymapOptions>(this.optionsPath);
    const component = options.application.component.find(
      (component) => component.$.name === JB.KEYMAP_MANAGER
    );

    const activeKeymap = [{ $: { name: kmName } }];
    if (!component) {
      const newComponent: JbOptionsComponent = {
        $: { name: JB.KEYMAP_MANAGER },
        active_keymap: activeKeymap,
      };
      options.application.component.push(newComponent);
    } else {
      component.active_keymap = activeKeymap;
    }
    return fsUtils.saveXml<JbKeymapOptions>(this.optionsPath, options);
  }

  private defaultConfig(configName: string): JbXmlConfig {
    return {
      keymap: {
        $: {
          name: APP_NAME,
          parent: configName,
        },
        action: [],
      },
    };
  }

  private static mapSchema(schema?: string): Schema {
    switch (schema) {
      case 'Visual Studio':
        return SchemaTypes.VISUAL_STUDIO;
      case 'Sublime Text':
        return SchemaTypes.SUBLIME;
      default:
        return SchemaTypes.INTELLIJ;
    }
  }
}
