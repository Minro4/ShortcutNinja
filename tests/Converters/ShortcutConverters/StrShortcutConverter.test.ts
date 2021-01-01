import { StrShortcutConverter } from "../../../src/Connectors/Converters/ShortcutConverter";
import { HoldableKeys, IShortcut } from "../../../src/Connectors/Shortcut";

describe("StrShortcutConverter test", function () {
  const converter = new StrShortcutConverter();
  let uniSingle: IShortcut;
  let uniChorded: IShortcut;
  const ideSingle = "shift+alt+a";
  const ideChorded = "shift+alt+a ctrl+alt+b";

  beforeEach(() => {
    uniSingle = {
      sc1: {
        key: "a",
        holdedKeys: new Set<HoldableKeys>(["alt", "shift"]),
      },
    };

    uniChorded = {
      sc1: {
        key: "a",
        holdedKeys: new Set<HoldableKeys>(["alt", "shift"]),
      },
      sc2: {
        key: "b",
        holdedKeys: new Set<HoldableKeys>(["alt", "ctrl"]),
      },
    };
  });

  it("ToIde single shortcut", async function () {
    const ideSc = converter.toIde(uniSingle);
    expect(ideSc).toEqual(ideSingle);
  });

  it("ToIde chorded shortcut", async function () {
    const ideSc = converter.toIde(uniChorded);
    expect(ideSc).toEqual(ideChorded);
  });

  it("ToUni single shortcut", async function () {
    const uniSc = converter.toUni(ideSingle);
    expect(uniSc).toEqual(uniSingle);
  });

  it("ToUni chorded shortcut", async function () {
    const uniSc = converter.toUni(ideChorded);
    expect(uniSc).toEqual(uniChorded);
  });
});
