import { IConverter } from './Converters/Converter';


export enum IdeType {
  Jetbrains,
  VisualStudio,
  VsCode,
  Intell,
}

export interface Ide {
  name: string;
  type: IdeType;
  converter: IConverter;
}



