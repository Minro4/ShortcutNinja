import { IdeMappings, IdeMappingsUtils } from '../src/Connectors/Ide';
import { ShortcutDefinitions } from '../src/Connectors/ShortcutDefinitions';

(async () => {
  //Takes the name of the json file as argument
  const args = process.argv.slice(2);
  await PrepareIdeMappings(args[0]);
})();

async function PrepareIdeMappings(path: string) {
  const definitions = await ShortcutDefinitions.read();
  let mappings: IdeMappings;
  try {
    mappings = await IdeMappingsUtils.read(path);
  } catch (err) {
    mappings = {};
  }

  mappings = definitions.definitions.reduce<IdeMappings>((mapping, definition) => {
    if (!mapping[definition.id]){
      mapping[definition.id] = [];
    }
    return mapping;
  }, mappings)

  await IdeMappingsUtils.save(path,mappings);
}
