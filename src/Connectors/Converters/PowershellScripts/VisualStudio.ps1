function Export {
    [CmdletBinding()]
    param(
        [string] $SettingsPath,
        [string] $DevEnvExe,
        [int] $SecondsToSleep = 20 # should be enough for most machines
    )
    Write-Host "allo3"

    if (-not (Test-Path $DevEnvExe)) {
        throw "Could not find visual studio at: $DevEnvExe - is it installed?"
    }

    $Args = "/Command `"Tools.ImportandExportSettings /export:$SettingsPath`""
    Write-Verbose "$Args"
    Write-Host "Setting Tds Options, will take $SecondsToSleep seconds"
    $Process = Start-Process -FilePath $DevEnvExe -ArgumentList $Args -Passthru -WindowStyle Hidden
    Sleep -Seconds $SecondsToSleep #hack: couldnt find a way to exit when done
    $Process.Kill()
}

function Import {
    [CmdletBinding()]
    param(
        [string] $SettingsPath,
        [string] $DevEnvExe,
        [int] $SecondsToSleep = 20 # should be enough for most machines
    )
    Write-Host "allo2"

    if (-not (Test-Path $DevEnvExe)) {
        throw "Could not find visual studio at: $DevEnvExe - is it installed?"
    }

    if (-not (Test-Path $SettingsPath)) {
        throw "Could not find settings file at: $SettingsPath"
    }

    $SettingsStagingFile = "C:\Windows\temp\Settings.vssettings" # must be in a folder without spaces
    Copy-Item $SettingsPath $SettingsStagingFile -Force -Confirm:$false

    $Args = "/Command `"Tools.ImportandExportSettings /import:$SettingsStagingFile`""
    Write-Verbose "$Args"
    Write-Host "Setting Tds Options, will take $SecondsToSleep seconds"
    $Process = Start-Process -FilePath $DevEnvExe -ArgumentList $Args -Passthru -WindowStyle Hidden
    Sleep -Seconds $SecondsToSleep #hack: couldnt find a way to exit when done
    $Process.Kill()
}
Write-Host "Done"