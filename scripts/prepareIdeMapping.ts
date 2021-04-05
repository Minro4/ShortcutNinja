import { IIdeMappings } from '../src/Connectors/IdeMappings';
import * as path from 'path'
import { IDE_MAPPINGS_PATH } from '../src/Connectors/Constants/general';
import { fsUtils } from '../src/Connectors/Utils';
import { ShortcutCategories } from '../src/Connectors/ShortcutDefinitions';

(async () => {
  //Takes the name of the json file as argument
  const args = process.argv.slice(2);
  await PrepareIdeMappings(args[0]);
})();

async function PrepareIdeMappings(fileName: string) {
  const filePath = path.join(IDE_MAPPINGS_PATH, fileName);

  const definitions = ShortcutCategories.baseCategories.flatten();
  let mappings: IIdeMappings;
  try {
    mappings = await fsUtils.readJson<IIdeMappings>(filePath);
  } catch (err) {
    mappings = {};
  }

  mappings = definitions.reduce<IIdeMappings>((mapping, definition) => {
    if (!mapping[definition.id]){
      mapping[definition.id] = [];
    }
    return mapping;
  }, mappings)

  await fsUtils.saveJson<IIdeMappings>(filePath,mappings);
}
