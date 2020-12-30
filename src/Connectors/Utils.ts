import { promises as fs, constants, access } from "fs";
import stripJsonComments = require("strip-json-comments");
import { Builder, parseStringPromise } from "xml2js";

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
  export async function readXml<T>(path: string, encoding = defaultEncoding) {
    return (await parseStringPromise(await fs.readFile(path, encoding))) as T;
  }
  export async function saveXml<T>(
    path: string,
    xml: T,
    encoding = defaultEncoding
  ) {
    return saveFile(path, new Builder().buildObject(xml), encoding);
  }

  export async function readJson<T>(
    path: string,
    encoding = defaultEncoding
  ): Promise<T> {
    return JSON.parse(stripJsonComments(await fs.readFile(path, encoding)));
  }

  export async function saveJson<T>(
    path: string,
    json: T,
    encoding = defaultEncoding,
    replacer?: (key: any, value: any) => any
  ) {
    console.log(JSON.stringify(json));
    return saveFile(path, JSON.stringify(json, replacer), encoding);
  }

  export function saveFile(
    path: string,
    data: string,
    encoding = defaultEncoding
  ) {
    return fs.writeFile(path, data, encoding);
  }

  export function exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      access(path, constants.F_OK, (err) => {
        resolve(!err);
      });
    });
  }

  export function readdir(path: string) {
    return fs.readdir(path);
  }
}

export async function asyncFilter<T>(
  arr: T[],
  predicate: (a: T) => Promise<boolean>
) {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
}
