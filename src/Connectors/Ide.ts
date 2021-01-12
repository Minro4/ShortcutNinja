import path from 'path';
import { IDE_MAPPINGS_PATH } from './Constants/general';
import { IConverter } from './Converters/Converter';
import { fsUtils } from './Utils';

export enum IdeType {
  Jetbrains,
  VisualStudio,
  VsCode,
}

export interface Ide {
  name: string;
  converter: IConverter;
  type: IdeType;
}

export interface IdeMappings {
  //Universal name: ide name
  [key: string]: string[];
}

export class IdeMappingsUtils {
  public static toIde(
    ideMappings: IdeMappings,
    universalKey: string
  ): string[] {
    return ideMappings[universalKey];
  }

  public static toUni(
    ideMappings: IdeMappings,
    ideKey: string
  ): string | undefined {
    for (const key in ideMappings) {
      if (ideMappings[key].includes(ideKey)) {
        return key;
      }
    }
  }

  public static read(mappingName: string): Promise<IdeMappings> {
    return fsUtils.readJson<IdeMappings>(
      path.join(IDE_MAPPINGS_PATH, mappingName)
    );
  }

  public static save(mappingName: string, mapping: IdeMappings): Promise<any> {
    return fsUtils.saveJson<IdeMappings>(
      path.join(IDE_MAPPINGS_PATH, mappingName),
      mapping
    );
  }
}
