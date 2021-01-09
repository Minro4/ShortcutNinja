import { promises as fs, constants, access } from 'fs';
import stripJsonComments from 'strip-json-comments';
import { Builder, parseStringPromise } from 'xml2js';

export class fsUtils {
  private static readonly DEFAULT_ENCODING: BufferEncoding = 'utf-8';

  public static async readAllFilesInDir<T>(
    dirPath: string,
    encoding = fsUtils.DEFAULT_ENCODING
  ): Promise<T[]> {
    return fs.readdir(dirPath).then(async (filenames) => {
      const objs: T[] = [];
      await Promise.all(
        filenames.map(async (filename) => {
          await fsUtils
            .readJson<T>(dirPath + filename, encoding)
            .then((content) => {
              objs.push(content);
            });
        })
      );
      return objs;
    });
  }
  public static async readXml<T>(
    path: string,
    encoding = fsUtils.DEFAULT_ENCODING
  ): Promise<T> {
    return (await parseStringPromise(await fs.readFile(path, encoding))) as T;
  }
  public static async saveXml<T>(
    path: string,
    xml: T,
    encoding = fsUtils.DEFAULT_ENCODING
  ): Promise<void> {
    return fsUtils.saveFile(path, new Builder().buildObject(xml), encoding);
  }

  public static async readJson<T>(
    path: string,
    encoding = fsUtils.DEFAULT_ENCODING
  ): Promise<T> {
    return JSON.parse(stripJsonComments(await fs.readFile(path, encoding)));
  }

  public static async saveJson<T>(
    path: string,
    json: T,
    encoding = fsUtils.DEFAULT_ENCODING,
    replacer?: (key: any, value: any) => any
  ): Promise<void> {
    return fsUtils.saveFile(path, JSON.stringify(json, replacer), encoding);
  }

  public static saveFile(
    path: string,
    data: string,
    encoding = fsUtils.DEFAULT_ENCODING
  ): Promise<void> {
    return fs.writeFile(path, data, encoding);
  }

  public static exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      access(path, constants.F_OK, (err) => {
        resolve(!err);
      });
    });
  }
}
