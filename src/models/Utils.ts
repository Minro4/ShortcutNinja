import { promises as fs } from "fs";

export namespace fsUtils {
  const defaultEncoding: BufferEncoding = "utf-8";

  export async function readAllFilesInDir<T>(
    dirPath: string,
    encoding = defaultEncoding
  ): Promise<T[]> {
    return fs.readdir(dirPath).then(async (filenames) => {
      let objs: T[] = [];
      await Promise.all(
        filenames.map(async (filename) => {
          await readJson<T>(dirPath + filename, encoding).then((content) => {
            objs.push(content);
          });
        })
      );
      return objs;
    });
  }

  export async function readJson<T>(
    path: string,
    encoding = defaultEncoding
  ): Promise<T> {
    return JSON.parse(await fs.readFile(path, encoding));
  }

  export function saveFile(
    path: string,
    data: string,
    encoding = defaultEncoding
  ) {
    return fs.writeFile(path, data, encoding);
  }
}
