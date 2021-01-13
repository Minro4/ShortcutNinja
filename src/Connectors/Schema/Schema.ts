import { UniversalKeymap } from '../Keymap';

export class Schema {
  label: string;
  private schema: UniversalKeymap;

  constructor(label: string, schema: UniversalKeymap) {
    this.label = label;
    this.schema = schema;
  }

  get(): UniversalKeymap {
    return this.schema.clone();
  }
}


