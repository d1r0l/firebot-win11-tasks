import { version as localVersion } from "@/main";
import { logger } from "@oceanity/firebot-helpers/firebot";

type RemoteVersionCheckResponse = {
  localVersion: string;
  remoteVersion: string | null;
  newVersionAvailable: boolean;
};

export async function checkRemoteVersionAsync(): Promise<RemoteVersionCheckResponse> {
  let remoteVersion: string | null = null;
  let remoteIsNewer = false;

  try {
    const githubPackageResponse = await fetch(
      "https://raw.githubusercontent.com/d1r0l/firebot-win11-tasks/main/package.json"
    );
    remoteVersion = (await githubPackageResponse.json()).version;

    if (remoteVersion === null) {
      throw new Error("Failed to get remote version");
    }

    const splitLocal = localVersion.split(".");
    const splitRemote = remoteVersion.split(".");

    for (let i = 0; i < Math.min(splitLocal.length, splitRemote.length); i++) {
      // Ensure that both versions have the same number of sections
      if (!splitLocal[i]) splitLocal[i] = "0";
      if (!splitRemote[i]) splitRemote[i] = "0";

      // Check numerically and alphabetically
      const localInt = parseInt(splitLocal[i]);
      const remoteInt = parseInt(splitRemote[i]);

      if (remoteInt > localInt || splitRemote[i] > splitLocal[i]) {
        remoteIsNewer = true;
        break;
      } else if (remoteInt < localInt || splitRemote[i] < splitLocal[i]) {
        break;
      }
    }
  } catch (error) {
    logger.error("Error checking remote version", error);
  }

  return {
    localVersion,
    remoteVersion,
    newVersionAvailable: remoteIsNewer,
  };
}
