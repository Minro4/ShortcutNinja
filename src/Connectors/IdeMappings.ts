import path from 'path';
import { IDE_MAPPINGS_PATH } from './Constants/general';
import { fsUtils } from './Utils';
import vscodeMappings from './Config/ideMappings/vscode.json';
import visualStudioMappings from './Config/ideMappings/VisualStudio.json';
import jetbrainsMappings from './Config/ideMappings/JetBrains.json';

export interface IIdeMappings {
  //Universal name: ide name
  [key: string]: string[];
}

export class IdeMappings {
  public static VS_CODE = new IdeMappings(vscodeMappings as IIdeMappings);
  public static VISUAL_STUDIO = new IdeMappings(
    visualStudioMappings as IIdeMappings
  );
  public static JETBRAINS = new IdeMappings(jetbrainsMappings as IIdeMappings);

  public mappings: IIdeMappings;

  constructor(mappings: IIdeMappings) {
    this.mappings = mappings;
  }

  public toIde(universalKey: string): string[] {
    return this.mappings[universalKey];
  }

  public toUni(ideKey: string): string | undefined {
    for (const key in this.mappings) {
      if (this.mappings[key].includes(ideKey)) {
        return key;
      }
    }
  }

  public has(uniKey: string): boolean {
    return this.mappings[uniKey] != undefined;
  }

  public hasIdeKey(ideKey: string): boolean {
    return this.toUni(ideKey) != undefined;
  }

  public keys(): string[] {
    return Object.keys(this.mappings);
  }

  public static save(mappingName: string, mapping: IIdeMappings): Promise<any> {
    return fsUtils.saveJson<IIdeMappings>(
      path.join(IDE_MAPPINGS_PATH, mappingName),
      mapping
    );
  }
}
