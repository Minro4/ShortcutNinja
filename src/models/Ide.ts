import { Converter } from "./Converters/Converter";

export interface Ide {
  name: string;
  converter: Converter;
}

export class IdeMappings {
    //Universal name: ide name
    [key: string]: string;
}