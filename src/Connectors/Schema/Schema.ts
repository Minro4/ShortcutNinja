export interface Schema {
  label: string;
  fileName: string;
}

export namespace SCHEMA_TYPES {
  export const VISUAL_STUDIO: Schema = {
    label: "Visual Studio",
    fileName: "VisualStudio.json",
  };

  export const ATOM: Schema = {
    label: "Atom",
    fileName: "atom.json",
  };

  export const INTELLIJ: Schema = {
    label: "IntelliJ",
    fileName: "intelliJ.json",
  };

  export const NOTEPADPP: Schema = {
    label: "NodePad++",
    fileName: "notepadplusplus.json",
  };

  export const SUBLIME: Schema = {
    label: "Sublime",
    fileName: "sublime.json",
  };

  export const VS_CODE: Schema = {
    label: "VS Code",
    fileName: "vscode.json",
  };

  export const SCHEMAS: Schema[] = [
    VISUAL_STUDIO,
    ATOM,
    INTELLIJ,
    NOTEPADPP,
    SUBLIME,
    VS_CODE,
  ];
}
