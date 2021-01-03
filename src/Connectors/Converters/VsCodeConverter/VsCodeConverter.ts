import { IKeymap, UniversalKeymap } from '../../UniversalKeymap';
import { SchemaTypes } from '../../Schema/Schema';
import { fsUtils } from '../../Utils';
import { Converter } from '../Converter';
import { StrShortcutConverter } from '../ShortcutConverter';
import { VsCodeKeybinding, VsCondeConfig } from './VsCodeConverter.models';
import { KEYBINDINGS_PATH } from '../../Constants/VsCode';
import { LoadSchema } from '../../Schema/SchemaLoader';

export class VsCodeConverter extends Converter<string> {
  private configPath: string;

  constructor(configPath?: string) {
    super('vscode.json', new StrShortcutConverter(), SchemaTypes.VS_CODE);

    this.configPath = configPath ?? KEYBINDINGS_PATH;
  }

  protected async readIdeKeymap(): Promise<IKeymap<string[]>> {
    const ideConfig = await fsUtils.readJson<VsCondeConfig>(this.configPath);
    return ideConfig.reduce<IKeymap<string[]>>((ideKm, vsCodeKb) => {
      if (ideKm[vsCodeKb.command]) ideKm[vsCodeKb.command].push(vsCodeKb.key);
      else ideKm[vsCodeKb.command] = [vsCodeKb.key];
      return ideKm;
    }, {});
  }

  protected async writeIdeKeymap(
    ideKeymap: IKeymap<string[]>
  ): Promise<unknown> {
    const uniSchema: UniversalKeymap = this.schema
      ? await LoadSchema(this.schema)
      : new UniversalKeymap();

    const ideSchema = uniSchema.toIdeKeymap(
      await this.ideMappings,
      this.scConverter
    );

    const newConfig = Object.keys(ideKeymap).flatMap<VsCodeKeybinding>(
      (ideKey) => {
        const bindings: VsCodeKeybinding[] = ideKeymap[ideKey].map(
          (ideShortcut) => {
            return {
              key: ideShortcut,
              command: ideKey,
            };
          }
        );

        //Unbind default shortcuts
        if (ideSchema[ideKey]) {
          bindings.push(
            ...ideSchema[ideKey].map((ideSchemaKey) => {
              return {
                key: ideSchemaKey,
                command: `-${ideKey}`,
              };
            })
          );
        }

        return bindings;
      }
    );

    return fsUtils.saveJson<VsCondeConfig>(this.configPath, newConfig);
  }
}
