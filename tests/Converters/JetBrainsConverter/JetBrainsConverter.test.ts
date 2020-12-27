import { JetBrainsConverter } from "../../../src/Connectors/Converters/JetbrainsConverter/JetBrainsConverter";
import { IUniversalKeymap } from "../../../src/Connectors/IUniversalKeymap";
import { HoldableKeys } from "../../../src/Connectors/Shortcut";
import { fsUtils } from "../../../src/Connectors/Utils";
import * as path from "path";
import { APP_NAME } from "../../../src/Connectors/Constants/general";
import { JB } from "../../../src/Connectors/Constants/JetBrains";
import {
  JbKeymapOptions,
  JbXmlConfig,
} from "../../../src/Connectors/Converters/JetbrainsConverter/JetBrains.models";

describe("JetBrains converter test", function () {
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

  const mockKeymapFolder = "./tests/Converters/JetBrains/mocks";
  const keymapOptionPath = path.join(mockKeymapFolder, "keymap.xml");
  const mockKeymap = path.join(mockKeymapFolder, "TestKeymap.xml");

  const converter = new JetBrainsConverter(keymapOptionPath, mockKeymapFolder);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Read config", async function () {
    const converted: IUniversalKeymap = await converter.load();
    expect(converted).toEqual(universalKm);
  });

  it("Write config", async function () {
    const expectedPath =
      path.join(mockKeymapFolder, APP_NAME) + `.${JB.CONFIG_EXTENTION}`;

    const expectedKeymap = await fsUtils.readXml<JbXmlConfig>(mockKeymap);
    const expectedOptions = await fsUtils.readXml<JbKeymapOptions>(
      keymapOptionPath
    );
    expectedOptions.application.component[0].active_keymap[0].$.name = APP_NAME;

    fsUtils.saveXml = jest.fn().mockReturnValue(Promise.resolve());
    await converter.save(universalKm);

    expect(fsUtils.saveXml).toHaveBeenCalledWith(
      keymapOptionPath,
      expectedOptions
    );
    expect(fsUtils.saveXml).toHaveBeenCalledWith(expectedPath, expectedKeymap);
  });
});
