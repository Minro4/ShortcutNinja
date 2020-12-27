import { IShortcutConverter } from "../src/Connectors/Converters/ShortcutConverter";
import { KeymapUtils } from "../src/Connectors/IUniversalKeymap";
import { IShortcut } from "../src/Connectors/Shortcut";

describe("Universal keymap tests", function () {
  const converter: IShortcutConverter<string> = {
    toIde: (shortcut: IShortcut) => {
      if ((shortcut.sc1.key = "uniSc")) return "ideSc";
      return "wrong";
    },
    toUni: (shortcut: string) => {
      if (shortcut == "ideSc")
        return { sc1: { key: "uniSc", holdedKeys: new Set() } };
    },
  };

  it("toUniKeymap should correctly map key and shortcut", async function () {
    let uni = KeymapUtils.toUniKeymap(
      { ideKey: ["ideSc"] },
      { uniKey: "ideKey" },
      converter
    );

    expect(uni.uniKey[0].sc1.key).toEqual("uniSc");
  });

  it("toUniKeymap should correctly map key and shortcut", async function () {
    let ideKm = KeymapUtils.toIdeKeymap(
      { uniKey: [{ sc1: { key: "uniSc", holdedKeys: new Set() } }] },
      { uniKey: "ideKey" },
      converter
    );

    expect(ideKm.ideKey).toEqual(["ideSc"]);
  });
});
