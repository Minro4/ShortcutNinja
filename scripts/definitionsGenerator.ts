import _vscodeSU from './SchemasUnprocessed/vscode.json';
import _intellijSU from './SchemasUnprocessed/intelliJ.json';
import _vsSU from './SchemasUnprocessed/VisualStudio.json';
import _atom from './SchemasUnprocessed/atom.json';
import {
  VsCodeConfig,
  VsCodeKeybinding,
} from '../src/Connectors/Converters/VsCodeConverter/VsCodeConverter.models';
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

interface intelliJVsCodeConfig extends VsCodeKeybinding {
  intellij?: string;
}

const vscodeSU = _vscodeSU as VsCodeConfig;
const intellijSU = _intellijSU as intelliJVsCodeConfig[];
const vsSU = _vsSU as VsCodeConfig;
const atom = _atom as VsCodeConfig;

(async () => {
  //await generateDefinitions();
  //await AddVsCodeMappings();
  await AddVSMappings();
})();

async function generateDefinitions() {
  console.log('a');
  const categories = ShortcutCategories.baseCategories;
  const unclassified = categories.categories.find(
    (cat) => cat.id == 'unclassified'
  )!;

  const counts = new Keymap<string>();

  const set = intellijSU.reduce<{ [key: string]: intelliJVsCodeConfig }>(
    (set, map) => {
      const k = VsCodeConverter.BuildIdeKey(map);
      if (!IdeMappings.VS_CODE.hasIdeKey(k)) {
        set[k] = map;
        counts.add(map.command, k);
      } else {
        console.log(k);
      }
      return set;
    },
    {}
  );

  /* counts.keys().forEach((k) => {
    const vs = counts.get(k);
    if (vs.length == 1) {
      IdeMappings.VS_CODE.mappings[k] = vs;
    } else {
      vs.forEach((v) => {
        IdeMappings.VS_CODE.mappings[v] = [v];
      });
    }
  });

  IdeMappings.save('vscode.json', IdeMappings.VS_CODE.mappings);*/

  //Cleanup
  counts.keys().forEach((k) => {
    const vs = counts.get(k);
    if (vs.length == 1) {
      const v = vs[0];
      const temp = set[v];
      delete set[v];
      set[k] = temp;
    } else {
      vs.forEach((a) => {
        if (a !== k) {
          delete set[a];
          console.log(a);
        }
      });
    }
  });

  vsSU.forEach((su) => {
    if (!set[su.command] && !IdeMappings.VS_CODE.hasIdeKey(su.command)) {
      set[su.command] = su;
    }
  });

  /*const hidden: IShortcutDefinition[] = [];
  atom.forEach((su) => {
    if (!set[su.command] && !IdeMappings.VS_CODE.hasIdeKey(su.command)) {
      hidden.push({id: su.command});
    }
  });
  categories.categories.push({
    label: "Hidden",
    id: "hidden",
    definitions:hidden
  })*/

  const s = Object.keys(set)
    .filter((k) => !IdeMappings.VS_CODE.has(k) && set[k])
    .sort()
    .map<IShortcutDefinition>((s: string) => {
      return { id: s, label: set[s].intellij };
    });

  unclassified.definitions = s;

  await fsUtils.saveJson(
    path.join(CONFIG_PATH, 'ShortcutDefinitions.json'),
    categories.categories
  );
}

async function AddVsCodeMappings() {
  const categories = ShortcutCategories.baseCategories;
  const definitions = categories.flatten();

  const mappings = definitions.reduce<IIdeMappings>((mappings, definition) => {
    const mappedTo = vscodeSU
      .filter((su) => su.command === definition.id)
      .map((to) => VsCodeConverter.BuildIdeKey(to));
    if (mappedTo.length > 0)
      mappings[definition.id] = [
        ...new Set((mappings[definition.id] ?? []).concat(mappedTo)),
      ];
    else
      mappings[definition.id] = [
        ...new Set((mappings[definition.id] ?? []).concat([definition.id])),
      ];
    return mappings;
  }, IdeMappings.VS_CODE.mappings);

  await IdeMappings.save('vscodeTest.json', mappings);
}

async function AddVSMappings() {
  const vsSchema = SchemaTypes.VISUAL_STUDIO.get();
  const definitions = ShortcutCategories.baseCategories.flatten();
  const vsMappings = IdeMappings.VISUAL_STUDIO;

  const json = await fsUtils.readJson<IJsonUniversalKeymap>(
    'scripts/VisualStudioMappings/UniVSMappings.json'
  );
  const vsKeymap = UniversalKeymap.fromJson(json);

  const toFilterOut = [
    'TeamFoundationContextMenus',
    'Image',
    'OtherContextMenus',
    'GraphView',
    'Timeline',
    'ArchitectureContextMenus',
    'Graphics',
    'SQL',
  ];

  const map = vsKeymap
    .keys()
    .filter(
      (k) => !toFilterOut.some((filterOut) => filterOut == k.split('.')[0])
    )
    .reduce((map, k) => {
      vsKeymap.get(k).forEach((sc) => {
        const uniKey = vsSchema.keys().find((vsk) => {
          return vsSchema.get(vsk).some((vssc: Shortcut) => {
            return vssc.equals(sc);
          });
        });
        if (uniKey && definitions.some((def) => def.id === uniKey)) {
          map.mappings[uniKey] = (map.mappings[uniKey] ?? []).concat(k);
        }
      });

      return map;
    }, vsMappings);

  map.keys().forEach((k) => {
    map.mappings[k] = [...new Set(map.mappings[k])];
  });

  IdeMappings.save('VisualStudioTest.json', map.mappings);
}
