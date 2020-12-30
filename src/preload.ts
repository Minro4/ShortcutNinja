// All of the Node.js APIs are available in the preload process.

import { JetBrainsConverter } from "./Connectors/Converters/JetbrainsConverter/JetBrainsConverter";
import { Connectors, ShortcutCreator } from "./Connectors/index";
import { VisualStudioScanner } from "./Connectors/Scanners/VisualStudioScanner";
import { HoldableKeys } from "./Connectors/Shortcut";

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

// needed in the renderer process.
let scCreator = new ShortcutCreator();

const onKeydown = async (event: KeyboardEvent) => {
  let ides = await Connectors.scan();
  console.log(ides);
  ides.forEach((ide) =>
    ide.converter.save({
      formatDocument: [
        {
          sc1: { key: "b", holdedKeys: new Set<HoldableKeys>(["ctrl"]) },
        },
      ],
    })
  );

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
