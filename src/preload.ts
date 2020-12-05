// All of the Node.js APIs are available in the preload process.

import { VsCodeConverter } from "./models/Converters/VsCodeConverter";
import { Scanner } from "./models/Scanners/Scanner";
import { ShortcutCreator } from "./models/Shortcut";

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(
      `${type}-version`,
      process.versions[type as keyof NodeJS.ProcessVersions]
    );
  }
});

let vs = VsCodeConverter.get().load();
console.log(vs);

// needed in the renderer process.
let scCreator = new ShortcutCreator();

const onKeydown = async (event: KeyboardEvent) => {
  let scan = new Scanner();
  let ides = await scan.scan();

  let sc = scCreator.onKeydown(event.key);
  if (sc) {
    console.log("created shortcut " + sc);
  }
  console.log(scCreator.toString());
};

const onKeyup = (event: KeyboardEvent) => {
  scCreator.onKeyup(event.key);
  console.log(scCreator.toString());
};

window.addEventListener("keydown", onKeydown, true);
window.addEventListener("keyup", onKeyup, true);
