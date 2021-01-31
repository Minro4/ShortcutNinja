import { StrShortcutConverter } from '../../src/Connectors/Converters/ShortcutConverter';
import { UniversalKeymap } from '../../src/Connectors/Keymap';
import { Mappings } from '../../src/Connectors/Keymap/Keymap';
import { Shortcut } from '../../src/Connectors/Shortcut';
import { fsUtils } from '../../src/Connectors/Utils';

(async () => {
  await HtmlToMappings();
})();

async function HtmlToMappings() {
  const xml = await fsUtils.readXml<xml>(
    'scripts/VisualStudioMappings/VSMappings.xml'
  );

  console.log(xml);

  const map = xml.main.div.reduce<Mappings<string[]>>((map, d) => {
    d.table[0].tbody[0].tr.reduce<Mappings<string[]>>((nMap, t) => {
      const l = t.td[1] as {
        strong: string[];
      };
      if (l.strong) {
        nMap[(t.td[0] as string).trim()] = l.strong;
      }

      return nMap;
    }, map);

    return map;
  }, {});

  const converter = new StrShortcutConverter('+', ', ');

  const scMap = Object.keys(map).reduce<Mappings<Shortcut[]>>((scMap, k) => {
    const scs = map[k]
      .map(converter.toUni.bind(converter))
      .filter((s) => s) as Shortcut[];
    scMap[k] = scs;
    return scMap;
  }, {});

  const uni = new UniversalKeymap(scMap);

  await fsUtils.saveJson('scripts/VisualStudioMappings/VSMappings.json', map);
  await fsUtils.saveJson(
    'scripts/VisualStudioMappings/UniVSMappings.json',
    uni.toJson()
  );
}

interface xml {
  main: {
    div: {
      $: {
        class: string;
      };

      table: {
        tbody: {
          tr: {
            td: (
              | string
              | {
                  strong: string[];
                }
            )[];
          }[];
        }[];
      }[];
    }[];
  };
}
