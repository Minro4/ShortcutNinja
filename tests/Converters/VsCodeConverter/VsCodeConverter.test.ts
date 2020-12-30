import { VsCodeConverter } from "../../../src/Connectors/Converters/VsCodeConverter";
import { IUniversalKeymap } from "../../../src/Connectors/IUniversalKeymap";
import { HoldableKeys } from "../../../src/Connectors/Shortcut";
import { fsUtils } from "../../../src/Connectors/Utils";
import * as path from "path";

describe("vscode converter test", function () {
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

  const mockKeymapFolder = "./tests/Converters/VsCodeConverter/mocks";
  const mockKeybindings = path.join(mockKeymapFolder, "keybindings.json");

  const converter = new VsCodeConverter(mockKeybindings);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Read config", async function () {
    const converted: IUniversalKeymap = await converter.load();
    expect(converted).toEqual(universalKm);
  });

  it("Write config", async function () {
    fsUtils.saveJson = jest.fn().mockReturnValue(Promise.resolve());
    const expectedKeymap = await fsUtils.readJson(mockKeybindings);
    await converter.save(universalKm);
    expect(fsUtils.saveJson).toHaveBeenCalledWith(mockKeybindings, expectedKeymap);
  });
});
