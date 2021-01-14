import { UniversalKeymap } from '../../Keymap';
import { Schema } from '../../Schema/Schema';
import { SchemaTypes } from '../../Schema/SchemaTypes';
import { fsUtils } from '../../Utils';
import { Converter } from '../Converter';
import { StrShortcutConverter } from '../ShortcutConverter';
import {
  VsCodeKeybinding,
  VsCodeConfig,
  VsCodeShortcut,
} from './VsCodeConverter.models';
import { KEYBINDINGS_PATH } from '../../Constants/VsCode';
import { Keymap } from '../../Keymap';
import { IdeMappings } from '../../IdeMappings';

export class VsCodeConverter extends Converter<VsCodeShortcut> {
  private configPath: string;
  private schema: Schema;
  private readonly substractChar = '-';

  private readonly commandWhenSeperator = ' when ';

  constructor(configPath?: string, schema: Schema = SchemaTypes.VS_CODE) {
    super(IdeMappings.VS_CODE, new StrShortcutConverter());
    this.schema = schema;
    this.configPath = configPath ?? KEYBINDINGS_PATH;
  }

  public async save(keymap: UniversalKeymap): Promise<boolean> {
    const uniSchema = this.schema.get();
    keymap.removeSharedMappings(uniSchema);

    const ideKeymap = await this.toIdeKeymap(keymap);
    const ideSchema = await this.toIdeKeymap(uniSchema);

    const newConfig = ideKeymap
      .keys()
      .flatMap<VsCodeKeybinding>((ideKey) =>
        ideKeymap.get(ideKey).map((ideShortcut) => {
          return this.BuildVsCodeKeybinding(ideKey, ideShortcut);
        })
      )
      .concat(
        ideSchema.keys().flatMap<VsCodeKeybinding>((ideKey) =>
          ideSchema.get(ideKey).map((ideSchemaKey) => {
            return this.BuildVsCodeKeybinding(ideKey, ideSchemaKey, true);
          })
        )
      );

    await fsUtils.saveJson<VsCodeConfig>(this.configPath, newConfig);
    return true;
  }
  public async load(): Promise<UniversalKeymap> {
    let ideConfig: VsCodeConfig = [];
    try {
      ideConfig = await fsUtils.readJson<VsCodeConfig>(this.configPath);
    } catch (err) {
      ideConfig = [];
    }

    const schema = this.schema.get();

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
