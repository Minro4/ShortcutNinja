import { ShortcutCreator } from "../src/models/Shortcut";

describe("Shortcut creator tests", function () {
  let scCreator: ShortcutCreator;
  beforeEach(() => {
    scCreator = new ShortcutCreator();
  });

  it("single key", function () {
    scCreator.onKeydown("a");
    let sc = scCreator.onKeydown("Enter");
    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(0);
    expect(sc?.sc2).toBeUndefined();
  });

  it("holding key", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Control");
    scCreator.onKeydown("a");
    let sc = scCreator.onKeydown("Enter");
    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(2);
    expect(sc?.sc1.holdedKeys.has("Alt"));
    expect(sc?.sc1.holdedKeys.has("Control"));
    expect(sc?.sc2).toBeUndefined();
  });

  it("Keyup should remove holded key", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Control");
    scCreator.onKeyup("Alt");
    scCreator.onKeydown("a");
    let sc = scCreator.onKeydown("Enter");
    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(1);
    expect(sc?.sc1.holdedKeys.has("Control"));
    expect(sc?.sc2).toBeUndefined();
  });

  it("Should be able to enter chorded shortcuts", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Shift");
    scCreator.onKeydown("a");
    scCreator.onKeydown("Control");
    scCreator.onKeyup("Shift");
    scCreator.onKeydown("b");
    let sc = scCreator.onKeydown("Enter");

    expect(sc).not.toBeUndefined();
    //sc1
    expect(sc?.sc1.key).toEqual("a");
    expect(sc?.sc1.holdedKeys.size).toEqual(2);
    expect(sc?.sc1.holdedKeys.has("Alt"));
    expect(sc?.sc1.holdedKeys.has("Shift"));
    //sc2
    expect(sc?.sc2).not.toBeUndefined();
    expect(sc?.sc2?.key).toEqual("b");
    expect(sc?.sc2?.holdedKeys.size).toEqual(2);
    expect(sc?.sc2?.holdedKeys.has("Alt"));
    expect(sc?.sc2?.holdedKeys.has("Control"));
  });

  it("Should restart when there are 3 shortcuts inputed", function () {
    scCreator.onKeydown("Alt");
    scCreator.onKeydown("Shift");
    scCreator.onKeydown("a");
    scCreator.onKeydown("Control");
    scCreator.onKeyup("Shift");
    scCreator.onKeydown("b");
    scCreator.onKeydown("c");
    var sc = scCreator.onKeydown("Enter");

    expect(sc).not.toBeUndefined();
    expect(sc?.sc1.key).toEqual("c");
    expect(sc?.sc1.holdedKeys.size).toEqual(2);
    expect(sc?.sc1.holdedKeys.has("Control"));
    expect(sc?.sc1.holdedKeys.has("Shift"));
    expect(sc?.sc2).toBeUndefined();
  });
});
