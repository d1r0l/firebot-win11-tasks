import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Runs a PowerShell script and returns its trimmed stdout. Scripts are passed
 * via -EncodedCommand (base64 UTF-16LE) to sidestep shell quoting entirely,
 * since most OS-task scripts embed C# (Add-Type) with nested quotes.
 */
export async function runPowerShellAsync(script: string): Promise<string> {
  if (process.platform !== "win32") {
    throw new Error("PowerShell is only available on Windows");
  }

  const encodedCommand = Buffer.from(script, "utf16le").toString("base64");

  const { stdout } = await execAsync(
    `powershell.exe -NoProfile -NonInteractive -EncodedCommand ${encodedCommand}`,
    { windowsHide: true }
  );

  return stdout.trim();
}
