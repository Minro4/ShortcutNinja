import { IUniversalKeymap } from "../../src/models/IUniversalKeymap";
import { VsCodeConverter } from "../../src/models/Converters/VsCodeConverter";
import { fsUtils } from "../../src/models/Utils";
import { HoldableKeys } from "../../src/models/Shortcut";

describe("vscode converter test", function () {
  const vscodeKb = [
    {
      key: "shift+alt+f ctrl+a",
      command: "editor.action.formatDocument",
    },
  ];

  const universalKm: IUniversalKeymap = {
    formatDocument: {
      sc1: {
        key: "f",
        holdedKeys: new Set<HoldableKeys>(["alt", "shift"]),
      },
      sc2: {
        key: "a",
        holdedKeys: new Set<HoldableKeys>(["ctrl"]),
      },
    },
  };

  const converter = VsCodeConverter.get();

  it("Read config", async function () {
    fsUtils.readJson = jest.fn().mockReturnValue(Promise.resolve(vscodeKb));
    const converted: IUniversalKeymap = await converter.load();
    expect(converted).toEqual(universalKm);
  });

  it("Write config", async function () {
    fsUtils.saveJson = jest.fn().mockReturnValue(Promise.resolve());
    await converter.save(universalKm);
    expect(fsUtils.saveJson).toHaveBeenCalledWith(expect.anything(), vscodeKb);
  });
});
