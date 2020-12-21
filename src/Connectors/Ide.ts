import { IConverter } from "./Converters/Converter";

export interface Ide {
  name: string;
  converter: IConverter;
}

export interface IdeMappings {
  //Universal name: ide name
  [key: string]: string;
}

export namespace IdeMappingsUtils {
  export function toIde(ideMappings: IdeMappings, universalKey: string) {
    return ideMappings[universalKey];
  }

  export function toUni(ideMappings: IdeMappings, ideKey: string) {
    for (let key in ideMappings) {
      if (ideMappings[key] === ideKey) {
        return key;
      }
    }
  }
}
