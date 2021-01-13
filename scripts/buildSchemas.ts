import * as path from 'path';
import {
  SCHEMAS_PATH,
  UNPROCESSED_SCHEMAS_PATH,
} from '../src/Connectors/Constants/Schemas';
import { UniversalKeymap } from '../src/Connectors/Keymap';
import { VsCodeConverter } from '../src/Connectors/Converters/VsCodeConverter/VsCodeConverter';
import { SchemaTypes } from '../src/Connectors/Schema/SchemaTypes';

interface SchemaBuild {
  fileName: string;
  builder: (path: string) => Promise<UniversalKeymap>;
  parentSchema?: SchemaBuild;
  build?: Promise<UniversalKeymap>;
}

const VS_CODE: SchemaBuild = {
  fileName: "vscode.json",
  builder: VsCodeSchemaBuilder,
};

const VISUAL_STUDIO: SchemaBuild = {
  fileName: "VisualStudio.json",
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const ATOM: SchemaBuild = {
  fileName: "atom.json",
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const INTELLIJ: SchemaBuild = {
  fileName: "intelliJ.json",
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const NOTEPADPP: SchemaBuild = {
  fileName: "notepadplusplus.json",
  builder: VsCodeSchemaBuilder,
  parentSchema: VS_CODE,
};

const SUBLIME: SchemaBuild = {
  fileName: "sublime.json",
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

  const schemaPath = path.join(SCHEMAS_PATH, schema.fileName);

  const uniConfig = await GetBuild(schema);
  parentBuild.overrideKeymap(uniConfig);

  return parentBuild.saveKeymap(schemaPath);
}

async function GetBuild(schema: SchemaBuild): Promise<UniversalKeymap> {
  if (!schema.build) {
    const unprocessedSchemaPath = path.join(
      UNPROCESSED_SCHEMAS_PATH,
      schema.fileName
    );

    schema.build = schema.builder(unprocessedSchemaPath);
  }

  return schema.build;
}

async function VsCodeSchemaBuilder(path: string): Promise<UniversalKeymap> {
  return new VsCodeConverter(path, SchemaTypes.EMPTY).load();
}
