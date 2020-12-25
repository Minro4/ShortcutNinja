import { IKeymap, KeymapUtils } from "../../IUniversalKeymap";
import { JetBrainsShortcutConverter } from "./JetBrainsShortcutConverter";
import { JetBrainsShortcut, JetBrainsXmlConfig } from "./JetBrains.models";
import { Converter } from "../Converter";
import { fsUtils } from "../../Utils";
import glob = require("glob");
import fs = require("fs");
import { APP_NAME } from "../../Constants/general";

export class JetBrainsConverter extends Converter<JetBrainsShortcut> {
  private configPath: string;

  constructor(configPath: string) {
    super("JetBrains.json", new JetBrainsShortcutConverter());
    this.configPath = configPath;
  }

  protected async readIdeKeymap(): Promise<IKeymap<JetBrainsShortcut>> {
    const config = await this.latestConfig();
    if (!config) {
      //Schema is "Windows"
      return {};
    }
    return config.keymap.action.reduce((keymap, action) => {
      keymap[action.id] = action["keyboard-shortcut"];
      return keymap;
    }, {});
  }
  protected async writeIdeKeymap(
    ideKeymap: IKeymap<JetBrainsShortcut>
  ): Promise<void> {
    const filePath = `${this.configPath}/${
      this.configPath
    }/${APP_NAME}-${new Date().getTime()}`;

    //Read config and override it
    const config = (await this.latestConfig()) || this.defaultConfig();
    Object.keys(ideKeymap).reduce((config, keymapKey) => {
      const action = config.keymap.action.find(
        (action) => action.id == keymapKey
      );
      if (action) {
        action["keyboard-shortcut"] = ideKeymap[keymapKey];
      } else {
        config.keymap.action.push({
          id: keymapKey,
          "keyboard-shortcut": ideKeymap[keymapKey],
        });
      }
      return config;
    }, config);
    return fsUtils.saveXml<JetBrainsXmlConfig>(filePath, config);
  }

  private async latestConfig(): Promise<JetBrainsXmlConfig | undefined> {
    const globStr = `${this.configPath}/${this.configPath}/*`;

    const path = glob
      .sync(globStr)
      .reduce<{ path: string; date: Date } | undefined>(
        (latestPath, currentPath) => {
          const fileDate = fs.statSync(currentPath).mtime;
          return latestPath && latestPath.date > fileDate
            ? latestPath
            : {
                path: currentPath,
                date: fileDate,
              };
        },
        undefined
      )?.path;

    if (!path) {
      return undefined;
    }
    return await fsUtils.readXml<JetBrainsXmlConfig>(path);
  }

  private defaultConfig(): JetBrainsXmlConfig {
    return {
      keymap: {
        $: {
          name: APP_NAME,
        },
        action: [],
      },
    };
  }
}
