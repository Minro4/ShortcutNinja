import { UniversalKeymap } from '../../Keymap';
import { Schema, SchemaTypes } from '../../Schema/Schema';
import { fsUtils } from '../../Utils';
import { Converter } from '../Converter';
import { StrShortcutConverter } from '../ShortcutConverter';
import {
  VsCodeKeybinding,
  VsCodeConfig,
  VsCodeShortcut,
} from './VsCodeConverter.models';
import { KEYBINDINGS_PATH } from '../../Constants/VsCode';
import { LoadSchema } from '../../Schema/SchemaLoader';
import { Keymap } from '../../Keymap';

export class VsCodeConverter extends Converter<VsCodeShortcut> {
  private configPath: string;
  private schema;
  private readonly substractChar = '-';

  private readonly commandWhenSeperator = ' when ';

  constructor(configPath?: string, schema: Schema = SchemaTypes.VS_CODE) {
    super('vscode.json', new StrShortcutConverter());
    this.schema = schema;
    this.configPath = configPath ?? KEYBINDINGS_PATH;
  }

  public async save(keymap: UniversalKeymap): Promise<any> {
    const ideKeymap = await this.toIdeKeymap(keymap);

    const ideSchema = await this.fetchIdeSchema(this.schema);

    const newConfig = ideKeymap.keys().flatMap<VsCodeKeybinding>((ideKey) => {
      const bindings: VsCodeKeybinding[] = ideKeymap
        .get(ideKey)
        .map((ideShortcut) => {
          return this.BuildVsCodeKeybinding(ideKey, ideShortcut);
        });

      //Unbind default shortcuts

      bindings.push(
        ...ideSchema.get(ideKey).map((ideSchemaKey) => {
          return this.BuildVsCodeKeybinding(ideKey, ideSchemaKey, true);
        })
      );

      return bindings;
    });

    return fsUtils.saveJson<VsCodeConfig>(this.configPath, newConfig);
  }
  public async load(): Promise<UniversalKeymap> {
    let ideConfig: VsCodeConfig = [];
    try {
      ideConfig = await fsUtils.readJson<VsCodeConfig>(this.configPath);
    } catch (err) {
      ideConfig = [];
    }

    const schema = await LoadSchema(this.schema);

    const ideKeymapToRemove = new Keymap<VsCodeShortcut>();
    const ideKeymapToAdd = new Keymap<VsCodeShortcut>();

    ideConfig.forEach((vsCodeKb) => {
      const ideKey = this.BuildIdeKey(vsCodeKb);
      if (vsCodeKb.command.startsWith(this.substractChar)) {
        ideKeymapToRemove.add(ideKey, vsCodeKb.key);
      } else {
        ideKeymapToAdd.add(ideKey, vsCodeKb.key);
      }
    });

    const uniKeymapToRemove = await this.fromIdeKeymap(ideKeymapToRemove);
    const uniKeymapToAdd = await this.fromIdeKeymap(ideKeymapToAdd);

    schema.removeKeymap(uniKeymapToRemove);
    schema.addKeymap(uniKeymapToAdd);

    return schema;
  }

  private BuildVsCodeKeybinding(
    ideKey: string,
    keybinding: VsCodeShortcut,
    negatedCommand = false
  ): VsCodeKeybinding {
    // eslint-disable-next-line prefer-const
    let [command, when] = ideKey.split(this.commandWhenSeperator);
    command = negatedCommand ? `-${command}` : command;
    if (when) {
      return {
        key: keybinding,
        command,
        when,
      };
    } else {
      return {
        key: keybinding,
        command,
      };
    }
  }

  private BuildIdeKey(kb: VsCodeKeybinding): string {
    let command = kb.command;
    if (command.startsWith(this.substractChar))
      command = command.substring(this.substractChar.length);
    return command + (kb.when ? this.commandWhenSeperator + kb.when : '');
  }
}
