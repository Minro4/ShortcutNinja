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
  UniversalKeymap,
} from '../src/Connectors/UniversalKeymap';
import { VsCondeConfig } from '../src/Connectors/Converters/VsCodeConverter/VsCodeConverter.models';

interface SchemaBuild {
  schema: Schema;
  builder: (unprocessedSchema: any) => Promise<UniversalKeymap>;
  parentSchema?: SchemaBuild;
  build?: Promise<UniversalKeymap>;
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
  const parentBuild: UniversalKeymap = schema.parentSchema
    ? await GetBuild(schema.parentSchema)
    : new UniversalKeymap({});

  const schemaPath = path.join(SCHEMAS_PATH, schema.schema.fileName);

  const uniConfig = await GetBuild(schema);

  const combinedConfig = parentBuild.overrideKeymap(uniConfig);

  return combinedConfig.saveKeymap(schemaPath);
}

async function GetBuild(schema: SchemaBuild): Promise<UniversalKeymap> {
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
): Promise<UniversalKeymap> {
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

  return UniversalKeymap.fromIdeKeymap(
    ideConfig,
    ideMappings,
    new StrShortcutConverter()
  );
}
