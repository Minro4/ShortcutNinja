import { ShortcutCreator } from "../src/Connectors";

describe("Shortcut creator tests", function () {
  let scCreator: ShortcutCreator;
  beforeEach(() => {
    scCreator = new ShortcutCreator();
  });

  it("single key", function () {
    scCreator.onKeydown("a");
    const enter = scCreator.onKeydown("Enter");
    const sc = scCreator.create();
    expect(enter);
    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(0);
    expect(sc?.sc2).toBeUndefined();
  });

  it("holding key", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Control");
    scCreator.onKeydown("a");
    const enter = scCreator.onKeydown("Enter");
    const sc = scCreator.create();
    expect(enter);
    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(2);
    expect(sc?.sc1.holdedKeys.has("alt"));
    expect(sc?.sc1.holdedKeys.has("ctrl"));
    expect(sc?.sc2).toBeUndefined();
  });

  it("Keyup should remove holded key", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Control");
    scCreator.onKeyup("Alt");
    scCreator.onKeydown("a");
    const enter = scCreator.onKeydown("Enter");
    const sc = scCreator.create();
    expect(enter);
    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(1);
    expect(sc?.sc1.holdedKeys.has("ctrl"));
    expect(sc?.sc2).toBeUndefined();
  });

  it("Should be able to enter chorded shortcuts", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Shift");
    scCreator.onKeydown("a");
    scCreator.onKeydown("Control");
    scCreator.onKeyup("Shift");
    scCreator.onKeydown("b");
    const enter = scCreator.onKeydown("Enter");
    const sc = scCreator.create();
    expect(enter);

    expect(sc).not.toBeUndefined();
    //sc1
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(2);
    expect(sc?.sc1.holdedKeys.has("alt"));
    expect(sc?.sc1.holdedKeys.has("shift"));
    //sc2
    expect(sc?.sc2).not.toBeUndefined();
    expect(sc?.sc2?.key).toEqual("b");
    expect(sc?.sc2?.holdedKeys.size).toEqual(2);
    expect(sc?.sc2?.holdedKeys.has("alt"));
    expect(sc?.sc2?.holdedKeys.has("ctrl"));
  });

  it("Should restart when there are 3 shortcuts inputed", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Shift");
    scCreator.onKeydown("a");
    scCreator.onKeydown("Control");
    scCreator.onKeyup("Shift");
    scCreator.onKeydown("b");
    scCreator.onKeydown("c");
    const enter = scCreator.onKeydown("Enter");
    const sc = scCreator.create();
    expect(enter);

    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("c");
    expect(sc?.sc1.holdedKeys.size).toEqual(2);
    expect(sc?.sc1.holdedKeys.has("ctrl"));
    expect(sc?.sc1.holdedKeys.has("shift"));
    expect(sc?.sc2).toBeUndefined();
  });

  it("holding key up reverse order", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Control");
    scCreator.onKeyup("Control");
    scCreator.onKeyup("Alt");
    scCreator.onKeydown("f");
    const enter = scCreator.onKeydown("Enter");
    const sc = scCreator.create();
    expect(enter);
    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("f");
    expect(sc?.sc1.holdedKeys.size).toEqual(0);
  });
});
