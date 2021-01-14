import { UniversalKeymap } from '../Keymap';

export class Schema {
  label: string;
  private schema: UniversalKeymap;

  constructor(label: string, schema: UniversalKeymap) {
    this.label = label;
    this.schema = schema;
  }

  public get(): UniversalKeymap {
    return this.schema.clone();
  }

  public set(schema: UniversalKeymap): void {
    this.schema = schema;
  }
}
