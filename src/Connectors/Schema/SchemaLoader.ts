import { SCHEMAS_PATH } from "../Constants/Schemas";
import { IUniversalKeymap } from "../IUniversalKeymap";
import { fsUtils } from "../Utils";
import * as path from "path";
import { Schema } from "./Schema";

export async function LoadSchema(schema: Schema): Promise<IUniversalKeymap> {
  const schemaPath = path.join(SCHEMAS_PATH, schema.fileName);
  const json = await fsUtils.readJson<any>(schemaPath);
  Object.values<any[]>(json).forEach((shortcuts) => {
    shortcuts.forEach((shortcut) => {
      shortcut.sc1.holdedKeys = new Set(shortcut.sc1.holdedKeys);
      if (shortcut.sc2)
        shortcut.sc2.holdedKeys = new Set(shortcut.sc2.holdedKeys);
    });
  });

  return json as IUniversalKeymap;
}
