import vscode from './SchemasUnprocessed/vscode.json';
import { VsCodeConfig } from '../src/Connectors/Converters/VsCodeConverter/VsCodeConverter.models';
import {
  IShortcutDefinition,
  ShortcutCategories,
} from '../src/Connectors/ShortcutDefinitions';
import { Keymap, UniversalKeymap } from '../src/Connectors/Keymap';
import { VsCodeConverter } from '../src/Connectors/Converters/VsCodeConverter/VsCodeConverter';
import { fsUtils } from '../src/Connectors/Utils';
import { CONFIG_PATH } from '../src/Connectors/Constants/general';
import path from 'path';
import { IdeMappings, IIdeMappings } from '../src/Connectors/IdeMappings';
import { SchemaTypes } from '../src/Connectors/Schema/SchemaTypes';
import { IJsonUniversalKeymap } from '../src/Connectors/Keymap/UniversalKeymap';
import { Shortcut } from '../src/Connectors/Shortcut';

const vsCodeMappings = vscode as VsCodeConfig;

(async () => {
  await AddVSMappings();
})();

async function generateDefinitions() {
  const categories = ShortcutCategories.baseCategories;
  const unclassified = categories.categories.find(
    (cat) => cat.id == 'unclassified'
  )!;

  const counts = new Keymap<string>();

  const set = vsCodeMappings.reduce((set, map) => {
    const k = VsCodeConverter.BuildIdeKey(map);
    if (!IdeMappings.VS_CODE.hasIdeKey(k)) {
      set.add(k);
      counts.add(map.command, k);
    }
    return set;
  }, new Set<string>(unclassified.definitions.map((m) => m.id)));

  counts.keys().forEach((k) => {
    const vs = counts.get(k);
    if (vs.length == 1) {
      IdeMappings.VS_CODE.mappings[k] = vs;
    } else {
      vs.forEach((v) => {
        IdeMappings.VS_CODE.mappings[v] = [v];
      });
    }
  });

  IdeMappings.save('vscode.json', IdeMappings.VS_CODE.mappings);

  //Cleanup
  counts.keys().forEach((k) => {
    const vs = counts.get(k);
    if (vs.length == 1) {
      const v = vs[0];
      set.delete(v);
      set.add(k);
    }
  });

  const s = [...set].sort().map<IShortcutDefinition>((s: string) => {
    return { id: s };
  });

  unclassified.definitions = s;

  await fsUtils.saveJson(
    path.join(CONFIG_PATH, 'ShortcutDefinitionsTest.json'),
    categories
  );
}

async function AddVSMappings() {
  const vsSchema = SchemaTypes.VISUAL_STUDIO.get();
  const categories = ShortcutCategories.baseCategories;
  const vsMappings = IdeMappings.VISUAL_STUDIO;

  const json = await fsUtils.readJson<IJsonUniversalKeymap>(
    'scripts/VisualStudioMappings/UniVSMappings.json'
  );
  const vsKeymap = UniversalKeymap.fromJson(json);

  console.log(vsKeymap.keys());
  const map = vsKeymap.keys().reduce((map, k) => {
    vsKeymap.get(k).forEach((sc) => {
      const uniKey = vsSchema.keys().find((vsk) => {
        return vsSchema.get(vsk).some((vssc: Shortcut) => vssc.equals(sc));
      });
      console.log(uniKey);
      if (uniKey) {
        if (map.mappings[uniKey]) {
          map.mappings[uniKey].push(k);
        } else {
          map.mappings[uniKey] = [k];
        }
      }
    });

    return map;
  }, vsMappings);

  IdeMappings.save('VisualStudioTest.json', map.mappings);
}
