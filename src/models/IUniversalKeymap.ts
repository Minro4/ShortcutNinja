import { IShortcut } from "./Shortcut";

export interface IUniversalKeymap {
  //universal name: shortcut
  [key: string]: IShortcut;
}