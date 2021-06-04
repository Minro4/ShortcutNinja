import {
  JbShortcut,
  JbXmlConfig,
} from '../../src/Connectors/Converters/JetbrainsConverter/JetBrains.models';
import { JetBrainsShortcutConverter } from '../../src/Connectors/Converters/JetbrainsConverter/JetBrainsShortcutConverter';
import { IdeMappings } from '../../src/Connectors/IdeMappings';
import { Keymap } from '../../src/Connectors/Keymap';
import {
  UniversalKeymap,
  UniversalMappings,
} from '../../src/Connectors/Keymap/UniversalKeymap';
import { SchemaTypes } from '../../src/Connectors/Schema/SchemaTypes';
import { Shortcut } from '../../src/Connectors/Shortcut';
import { fsUtils } from '../../src/Connectors/Utils';

(async () => {
  await HtmlToMappings();
})();

async function HtmlToMappings() {
  const config = await fsUtils.readXml<JbXmlConfig>(
    'scripts/JetbrainsMappings/JbVsCodeKeymap.xml'
  );

  const ideKeymap = config.keymap.action.reduce<Keymap<JbShortcut>>(
    (keymap, action) => {
      if (action['keyboard-shortcut'])
        keymap.addAll(action.$.id, action['keyboard-shortcut']);
      return keymap;
    },
    new Keymap<JbShortcut>()
  );

  const scConverter = new JetBrainsShortcutConverter();

  const JbNamesMappingToVsCodeKeys = ideKeymap
    .keys()
    .reduce<UniversalMappings>((uniKeymap, ideKey) => {
      const sc: Shortcut[] = ideKeymap
        .get(ideKey)
        .map((shortcut) => {
          if (!shortcut) console.log(shortcut);
          return scConverter.toUni(shortcut);
        })
        .filter((shortcut) => shortcut != undefined) as Shortcut[];
      if (sc) uniKeymap[ideKey] = sc;

      return uniKeymap;
    }, {});

  const JbNamesUniKeymap = new UniversalKeymap(JbNamesMappingToVsCodeKeys);

  const vsCodeKeymap = SchemaTypes.VS_CODE.get();

  const mappings = vsCodeKeymap.keys().reduce((ideMapping, key) => {
    const vsCodeShortcuts = vsCodeKeymap.get(key);

    ideMapping.mappings[key] = vsCodeShortcuts.flatMap((vsCodeShortcut) => {
      const conflicts = JbNamesUniKeymap.conflicts(vsCodeShortcut);
      return conflicts.keys();
    });

    return ideMapping;
  }, IdeMappings.JETBRAINS);

  IdeMappings.save('JetbrainsTest.json', mappings.mappings);
}
