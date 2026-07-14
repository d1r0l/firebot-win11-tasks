import { runPowerShellAsync } from "./powershell";

const GET_ACTIVE_WINDOW_TITLE_SCRIPT = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Win11TasksNativeMethods {
  [DllImport("user32.dll")]
  public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")]
  public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
}
"@
$handle = [Win11TasksNativeMethods]::GetForegroundWindow()
$titleBuilder = New-Object System.Text.StringBuilder 256
[Win11TasksNativeMethods]::GetWindowText($handle, $titleBuilder, $titleBuilder.Capacity) | Out-Null
Write-Output $titleBuilder.ToString()
`;

export async function getActiveWindowTitleAsync(): Promise<string> {
  return runPowerShellAsync(GET_ACTIVE_WINDOW_TITLE_SCRIPT);
}
