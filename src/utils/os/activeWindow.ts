import { runPowerShellAsync } from "./powershell";

export interface ActiveWindowInfo {
  title: string;
  className: string;
  executableName: string;
  processId: number;
}

const GET_ACTIVE_WINDOW_INFO_SCRIPT = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Win11TasksNativeMethods {
  [DllImport("user32.dll")]
  public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")]
  public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")]
  public static extern int GetClassName(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")]
  public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
"@

$handle = [Win11TasksNativeMethods]::GetForegroundWindow()

$titleBuilder = New-Object System.Text.StringBuilder 256
[Win11TasksNativeMethods]::GetWindowText($handle, $titleBuilder, $titleBuilder.Capacity) | Out-Null

$classBuilder = New-Object System.Text.StringBuilder 256
[Win11TasksNativeMethods]::GetClassName($handle, $classBuilder, $classBuilder.Capacity) | Out-Null

[uint32]$processId = 0
[Win11TasksNativeMethods]::GetWindowThreadProcessId($handle, [ref]$processId) | Out-Null

$executableName = ""
try {
  $process = Get-Process -Id $processId -ErrorAction Stop
  $executableName = "$($process.ProcessName).exe"
} catch {}

[PSCustomObject]@{
  title          = $titleBuilder.ToString()
  className      = $classBuilder.ToString()
  executableName = $executableName
  processId      = [int]$processId
} | ConvertTo-Json -Compress
`;

export async function getActiveWindowInfoAsync(): Promise<ActiveWindowInfo> {
  const json = await runPowerShellAsync(GET_ACTIVE_WINDOW_INFO_SCRIPT);
  return JSON.parse(json) as ActiveWindowInfo;
}

/**
 * OBS encodes each field before joining (libobs/util/windows/window-helpers.c,
 * encode_dstr) so a literal ":" inside a title/class/exe can't be mistaken for
 * the field separator. "#" must be escaped first, since the escape sequences
 * themselves contain "#".
 */
function encodeObsWindowSelectorComponent(value: string): string {
  return value.replaceAll("#", "#22").replaceAll(":", "#3A");
}

/**
 * Builds the "title:class:executable" selector string OBS's window_capture
 * source (raw websocket `mode: "window"`, i.e. capture mode 1) expects for
 * its `window` input setting.
 */
export function toObsWindowSelector(info: ActiveWindowInfo): string {
  return [info.title, info.className, info.executableName]
    .map(encodeObsWindowSelectorComponent)
    .join(":");
}
