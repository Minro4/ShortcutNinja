import * as Shell from "node-powershell";

const POWERSHELL_SCRIPT_PATH =
  "./src/Connectors/Converters/VisualStudioConverter/VisualStudio.ps1";

export async function exportSettings(devenPath: string, settingsPath: string) {
  return importExport("Export", [
    { SettingsPath: settingsPath },
    { DevEnvExe: devenPath },
  ]);
}

export async function importSettings(devenPath: string, settingsPath: string) {
  return importExport("Import", [
    { SettingsPath: settingsPath },
    { DevEnvExe: devenPath },
  ]);
}

async function importExport(fct: string, params: { [key: string]: string }[]) {
  let ps = new Shell({
    executionPolicy: "Bypass",
    noProfile: true,
  });

  ps.addCommand(`. ${POWERSHELL_SCRIPT_PATH}`);
  ps.addCommand(fct);
  ps.addParameters(params);

  try {
    const ouput = await ps.invoke();
    ps.dispose();
    return ouput;
  } catch (err) {
    console.log(err);
    ps.dispose();
    throw err;
  }
}
