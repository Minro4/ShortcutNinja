import { Ide } from "../Ide";
import { fsUtils } from "../Utils";
import { IScanner } from "./IScanner";
//import * as path from 'path';

export class DirectoryScanner implements IScanner {
  private path: string;
  private ide: Ide;

  constructor(path: string, ide: Ide) {
    this.path = path;
    this.ide = ide;
  }

  async scan(): Promise<Ide[]> {
    if (await fsUtils.exists(this.path)) {
      return [this.ide];
    }
    return [];
  }
}
