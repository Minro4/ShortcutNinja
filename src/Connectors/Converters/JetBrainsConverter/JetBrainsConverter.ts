import { IKeymap, KeymapUtils } from "../../IUniversalKeymap";
import { JetBrainsShortcutConverter } from "./JetBrainsShortcutConverter";
import {
  JbKeymapOptions,
  JbOptionsComponent,
  JbShortcut,
  JbXmlConfig,
} from "./JetBrains.models";
import { Converter } from "../Converter";
import { fsUtils } from "../../Utils";
import glob = require("glob");
import fs = require("fs");
import * as path from "path";
import { APP_NAME } from "../../Constants/general";
import { JB } from "../../Constants/JetBrains";

export class JetBrainsConverter extends Converter<JbShortcut> {
  private optionsPath: string;
  private configFolder: string;

  constructor(optionsPath: string, configFolder: string) {
    super("JetBrains.json", new JetBrainsShortcutConverter());
    this.optionsPath = optionsPath;
    this.configFolder = configFolder;
  }

  protected async readIdeKeymap(): Promise<IKeymap<JbShortcut[]>> {
    const config = await this.fetchConfig();

    return config.keymap.action.reduce((keymap, action) => {
      keymap[action.$.id] = action["keyboard-shortcut"];
      return keymap;
    }, {});
  }
  protected async writeIdeKeymap(ideKeymap: IKeymap<JbShortcut[]>) {
    //Read config and override it
    const currentConfig = await this.fetchConfig();
    const newConfig = Object.keys(ideKeymap).reduce((config, keymapKey) => {
      const action = config.keymap.action.find(
        (action) => action.$.id == keymapKey
      );
      if (action) {
        action["keyboard-shortcut"] = ideKeymap[keymapKey];
      } else {
        config.keymap.action.push({
          $: { id: keymapKey },
          "keyboard-shortcut": ideKeymap[keymapKey],
        });
      }
      return config;
    }, currentConfig);

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
      return fsUtils.readXml<JbXmlConfig>(configPath);
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
    //TODO load default config depending on config name
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
}
