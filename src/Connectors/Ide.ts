import { IConverter } from './Converters/Converter';

export interface Ide {
  name: string;
  converter: IConverter;
}

export interface IdeMappings {
  //Universal name: ide name
  [key: string]: string[];
}

export class IdeMappingsUtils {
  public static toIde(ideMappings: IdeMappings, universalKey: string): string[] {
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
}
