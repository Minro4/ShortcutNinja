export interface Schema {
  label: string;
  fileName: string;
}

export class SchemaTypes {
  public static readonly VISUAL_STUDIO: Schema = {
    label: 'Visual Studio',
    fileName: 'VisualStudio.json',
  };

  public static readonly ATOM: Schema = {
    label: 'Atom',
    fileName: 'atom.json',
  };

  public static readonly INTELLIJ: Schema = {
    label: 'IntelliJ',
    fileName: 'intelliJ.json',
  };

  public static readonly NOTEPADPP: Schema = {
    label: 'NodePad++',
    fileName: 'notepadplusplus.json',
  };

  public static readonly SUBLIME: Schema = {
    label: 'Sublime',
    fileName: 'sublime.json',
  };

  public static readonly VS_CODE: Schema = {
    label: 'VS Code',
    fileName: 'vscode.json',
  };

  public readonly SCHEMAS: Schema[] = [
    SchemaTypes.VISUAL_STUDIO,
    SchemaTypes.ATOM,
    SchemaTypes.INTELLIJ,
    SchemaTypes.NOTEPADPP,
    SchemaTypes.SUBLIME,
    SchemaTypes.VS_CODE,
  ];
}
