import Shell from 'node-powershell';

export class VsImportExport {
  private static readonly POWERSHELL_SCRIPT_PATH =
    './src/Connectors/Converters/VisualStudioConverter/VisualStudio.ps1';

  public static async exportSettings(
    devenPath: string,
    settingsPath: string
  ): Promise<string> {
    return VsImportExport.importExport('Export', [
      { SettingsPath: settingsPath },
      { DevEnvExe: devenPath },
    ]);
  }

  public static async importSettings(
    devenPath: string,
    settingsPath: string
  ): Promise<string> {
    return VsImportExport.importExport('Import', [
      { SettingsPath: settingsPath },
      { DevEnvExe: devenPath },
    ]);
  }

  private static async importExport(
    fct: string,
    params: { [key: string]: string }[]
  ) {
    const ps = new Shell({
      executionPolicy: 'Bypass',
      noProfile: true,
    });

    ps.addCommand(`. ${VsImportExport.POWERSHELL_SCRIPT_PATH}`);
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
}
