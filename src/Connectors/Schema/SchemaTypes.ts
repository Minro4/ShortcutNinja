import { UniversalKeymap } from '../Keymap';
import { IJsonUniversalKeymap } from '../Keymap/UniversalKeymap';
import vscodeSchema from '../Config/Schemas/vscode.json';
import visualstudioSchema from '../Config/Schemas/VisualStudio.json';
import atomSchema from '../Config/Schemas/atom.json';
import intelliJSchema from '../Config/Schemas/intelliJ.json';
import notepadplusplusSchema from '../Config/Schemas/notepadplusplus.json';
import sublimeSchema from '../Config/Schemas/sublime.json';
import emptySchema from '../Config/Schemas/empty.json';
import { Schema } from './Schema';



export class SchemaTypes {
  public static readonly VISUAL_STUDIO = new Schema(
    'Visual Studio',
    UniversalKeymap.fromJson(visualstudioSchema as IJsonUniversalKeymap)
  );

  public static readonly ATOM = new Schema(
    'Atom',
    UniversalKeymap.fromJson(atomSchema as IJsonUniversalKeymap)
  );

  public static readonly INTELLIJ = new Schema(
    'IntelliJ',
    UniversalKeymap.fromJson(intelliJSchema as IJsonUniversalKeymap)
  );

  public static readonly NOTEPADPP = new Schema(
    'NodePad++',
    UniversalKeymap.fromJson(notepadplusplusSchema as IJsonUniversalKeymap)
  );

  public static readonly SUBLIME = new Schema(
    'Sublime',
    UniversalKeymap.fromJson(sublimeSchema as IJsonUniversalKeymap)
  );

  public static readonly VS_CODE = new Schema(
    'Visual Studio Code',
    UniversalKeymap.fromJson(vscodeSchema as IJsonUniversalKeymap)
  );

  public static readonly EMPTY = new Schema(
    'Empty',
    UniversalKeymap.fromJson(emptySchema as IJsonUniversalKeymap)
  );

  public static readonly SCHEMAS: Schema[] = [
    SchemaTypes.VS_CODE,
    SchemaTypes.VISUAL_STUDIO,
    SchemaTypes.INTELLIJ,
    SchemaTypes.ATOM,
    SchemaTypes.NOTEPADPP,
    SchemaTypes.SUBLIME,
    SchemaTypes.EMPTY,
  ];
}
