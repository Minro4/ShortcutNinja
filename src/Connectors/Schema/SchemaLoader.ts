import { SCHEMAS_PATH } from '../Constants/Schemas';

import * as path from 'path';
import { Schema } from './Schema';
import { UniversalKeymap } from '../UniversalKeymap';

export async function LoadSchema(schema: Schema): Promise<UniversalKeymap> {
  const schemaPath = path.join(SCHEMAS_PATH, schema.fileName);
  return UniversalKeymap.readKeymap(schemaPath);
}
