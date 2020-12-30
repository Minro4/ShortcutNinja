import { Ide } from "../Ide";

export interface IScanner {
  scan(): Promise<Ide[]>;
}
