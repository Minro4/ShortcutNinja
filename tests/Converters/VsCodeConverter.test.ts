import { VsCodeConverter } from "../../src/Connectors/Converters/VsCodeConverter";
import { IUniversalKeymap } from "../../src/Connectors/IUniversalKeymap";
import { HoldableKeys } from "../../src/Connectors/Shortcut";
import { fsUtils } from "../../src/Connectors/Utils";

describe("vscode converter test", function () {
  const vscodeKb = [
    {
      key: "shift+alt+f ctrl+a",
      command: "editor.action.formatDocument",
    },
  ];

  const universalKm: IUniversalKeymap = {
    formatDocument: [
      {
        sc1: {
          key: "f",
          holdedKeys: new Set<HoldableKeys>(["alt", "shift"]),
        },
        sc2: {
          key: "a",
          holdedKeys: new Set<HoldableKeys>(["ctrl"]),
        },
      },
    ],
  };

  const converter = VsCodeConverter.get();

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
