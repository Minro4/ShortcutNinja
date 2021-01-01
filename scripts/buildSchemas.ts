import { Schema, SchemaTypes } from '../src/Connectors/Schema/Schema';
import * as path from 'path';
import {
  SCHEMAS_PATH,
  UNPROCESSED_SCHEMAS_PATH,
} from '../src/Connectors/Constants/Schemas';
import { fsUtils } from '../src/Connectors/Utils';
import { IDE_MAPPINGS_PATH } from '../src/Connectors/Constants/general';
import { StrShortcutConverter } from '../src/Connectors/Converters/ShortcutConverter';
import { IdeMappings } from '../src/Connectors/Ide';
import {
  IKeymap,
  KeymapUtils,
  IUniversalKeymap,
} from '../src/Connectors/UniversalKeymap';
import { VsCondeConfig } from '../src/Connectors/Converters/VsCodeConverter/VsCodeConverter.models';

interface SchemaBuild {
  schema: Schema;
  builder: (unprocessedSchema: any) => Promise<IUniversalKeymap>;
  parentSchema?: SchemaBuild;
  build?: Promise<IUniversalKeymap>;
}

const VS_CODE: SchemaBuild = {
  schema: SchemaTypes.VS_CODE,
  builder: VsCodeSchemaBuilder,
};

const VISUAL_STUDIO: SchemaBuild = {
  schema: SchemaTypes.VISUAL_STUDIO,
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const ATOM: SchemaBuild = {
  schema: SchemaTypes.ATOM,
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const INTELLIJ: SchemaBuild = {
  schema: SchemaTypes.INTELLIJ,
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const NOTEPADPP: SchemaBuild = {
  schema: SchemaTypes.NOTEPADPP,
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const SUBLIME: SchemaBuild = {
  schema: SchemaTypes.SUBLIME,
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const SCHEMAS: SchemaBuild[] = [
  VISUAL_STUDIO,
  ATOM,
  INTELLIJ,
  NOTEPADPP,
  SUBLIME,
  VS_CODE,
];

(async () => {
  await BuildSchemas(SCHEMAS);
})();

function BuildSchemas(schemas: SchemaBuild[]): Promise<void[]> {
  return Promise.all(schemas.map(buildSchema));
}

async function buildSchema(schema: SchemaBuild) {
  const parentBuild: IUniversalKeymap = schema.parentSchema
    ? await GetBuild(schema.parentSchema)
    : {};

  const schemaPath = path.join(SCHEMAS_PATH, schema.schema.fileName);

  const uniConfig = await GetBuild(schema);

  const combinedConfig: IUniversalKeymap = { ...parentBuild, ...uniConfig };

  // console.log(combinedConfig["formatDocument"][0].sc1);
  console.log(
    JSON.stringify(combinedConfig['formatDocument'][0].sc1.holdedKeys)
  );

  return KeymapUtils.saveKeymap(schemaPath, combinedConfig);
}

function GetBuild(schema: SchemaBuild): Promise<IUniversalKeymap> {
  if (!schema.build) {
    const unprocessedSchemaPath = path.join(
      UNPROCESSED_SCHEMAS_PATH,
      schema.schema.fileName
    );

    schema.build = fsUtils
      .readJson<any>(unprocessedSchemaPath)
      .then((basicSchema) => schema.builder(basicSchema));
  }

  return schema.build;
}

async function VsCodeSchemaBuilder(
  unprocessedSchema: VsCondeConfig
): Promise<IUniversalKeymap> {
  const ideConfig = unprocessedSchema.reduce<IKeymap<string[]>>(
    (ideKm, vsCodeKb) => {
      ideKm[vsCodeKb.command] = [vsCodeKb.key];
      return ideKm;
    },
    {}
  );

  const ideMappings = await fsUtils.readJson<IdeMappings>(
    path.join(IDE_MAPPINGS_PATH, 'vscode.json')
  );

  return KeymapUtils.toUniKeymap(
    ideConfig,
    ideMappings,
    new StrShortcutConverter()
  );
}
