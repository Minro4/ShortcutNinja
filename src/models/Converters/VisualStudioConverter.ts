import { IdeMappings } from "../Ide";
import { IUniversalKeymap, IKeymap } from "../IUniversalKeymap";
import { Converter } from "./Converter";
import {
  IShortcutConverter,
  StrShortcutConverter,
} from "./ShortcutConverters/ShortcutConverter";
import { XmlConverter } from "./XmlConverter";
import * as Shell from "node-powershell";
import * as fs from "fs";
import { parseStringPromise } from "xml2js";
import * as chokidar from "chokidar";
import { fsUtils } from "../Utils";

export class VisualStudioConverter extends Converter<string> {
  private devenPath: string;

  private cmdExportImport =
    ". ./src/models/Converters/PowershellScripts/VisualStudio.ps1";

  constructor(devenPath: string) {
    super("VisualStudio.json", new StrShortcutConverter("+", ", "));
    this.devenPath = devenPath;
  }

  protected async readIdeKeymap(): Promise<IKeymap<string>> {
    const xml = (await this.loadSettings(
      this.devenPath
    )) as VisualStudioXmlConfig;
    const config = this.xmlToConfig(xml);

    //TODO Load scheme
    const scheme = {};

    return config.userShortcuts.reduce<IKeymap<string>>((km, sc) => {
      km[sc.command] = sc.keybind;
      return km;
    }, scheme);
  }
  protected async writeIdeKeymap(ideKeymap: IKeymap<string>): Promise<void> {
    console.log("asd");
    const xml = (await this.loadSettings(
      this.devenPath
    )) as VisualStudioXmlConfig;

    if (this.addKmToXml(xml, ideKeymap)) {
      const fileName = `temp/imported${new Date().getTime()}`;
      await fsUtils.saveXml(fileName, xml);
      this.importSettings(this.devenPath, fileName);
    }
  }

  private xmlToConfig(xml: VisualStudioXmlConfig): VisualStudioConfig {
    const sc:
      | VisualStudioXmlKeyboardShortcuts
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === "Environment_Group"
    )?.Category?.find((element) => element.$.name === "Environment_KeyBindings")
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
        scheme: "Visual Studio",
        userShortcuts: [],
      };
    }
  }

  private addKmToXml(
    xml: VisualStudioXmlConfig,
    ideKeymap: IKeymap<string>
  ): VisualStudioXmlConfig | undefined {
    const userShortcuts:
      | UserShortcuts[]
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === "Environment_Group"
    )?.Category?.find((element) => element.$.name === "Environment_KeyBindings")
      ?.KeyboardShortcuts[0]?.UserShortcuts;

    if (!userShortcuts) return undefined;
    userShortcuts[0] = userShortcuts[0] || {};
    const sc = userShortcuts[0];
    sc.Shortcut = sc.Shortcut || [];
    sc.RemoveShortcut = sc.RemoveShortcut || [];

    Object.keys(ideKeymap).forEach((key) => {
      sc.RemoveShortcut = sc.RemoveShortcut!.concat(
        sc.Shortcut!.filter((s) => s.$.Command === key)
      );
      sc.Shortcut = sc.Shortcut!.filter((s) => s.$.Command !== key);
      sc.Shortcut.push({
        $: {
          Command: key,
          Scope: "Global",
        },
        _: ideKeymap[key],
      });
    });
    return xml;
  }

  private loadSettings(
    devenPath: string,
    settingsPath: string = `temp/exported${new Date().getTime()}`
  ): Promise<any> {
    return new Promise((resolve, error) => {
      const watcher = chokidar.watch(`${settingsPath}.*`, { interval: 1 });
      watcher.on("add", (path) => {
        resolve(fsUtils.readXml(path));
        watcher.close();
      });
      this.exportSettings(devenPath, settingsPath);
    });
  }

  private async exportSettings(devenPath: string, settingsPath: string) {
    return this.importExport("Export", [
      { SettingsPath: settingsPath },
      { DevEnvExe: devenPath },
    ]);
  }

  private async importSettings(devenPath: string, settingsPath: string) {
    return this.importExport("Import", [
      { SettingsPath: settingsPath },
      { DevEnvExe: devenPath },
    ]);
  }

  private async importExport(fct: string, params: { [key: string]: string }[]) {
    let ps = new Shell({
      executionPolicy: "Bypass",
      noProfile: true,
    });

    ps.addCommand(this.cmdExportImport);
    ps.addCommand(fct);
    ps.addParameters(params);

    try {
      const ouput = await ps.invoke();
      ps.dispose();
      return ouput;
    } catch (err) {
      console.log(err);
      ps.dispose();
      throw err;
    }
  }
}

interface VisualStudioXmlConfig {
  UserSettings: {
    Category: Category[];
  };
}

interface VisualStudioXmlKeyboardShortcuts {
  ScopeDeginitions: any[];
  DefaultShortcuts: any[];
  ShortcutsScheme: string[];
  UserShortcuts: UserShortcuts[];
}

interface UserShortcuts {
  Shortcut?: VisualStudioSc[];
  RemoveShortcut?: VisualStudioSc[];
}

interface VisualStudioSc {
  _: string;
  $: {
    Command: string;
    Scope: string;
  };
}

interface Category {
  $: {
    name: string;
  };
  Category?: Category[];
  [key: string]: any;
}

interface VisualStudioConfig {
  scheme: string;
  userShortcuts: { command: string; keybind: string }[];
}
