import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import * as packageJson from "../package.json";

export const {
  version,
  name: namespace,
  displayName: name,
  description,
  author,
} = packageJson;

import {
  chatFeedAlert,
  effectManager,
  initModules,
  logger,
} from "@oceanity/firebot-helpers/firebot";
import { AllWin11TasksEffects } from "./firebot/effects";
import { checkRemoteVersionAsync } from "./firebot/versionCheck";

type Params = Record<string, never>;

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name,
      description,
      author,
      version,
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: async (runRequest) => {
    // Setup globals
    initModules(runRequest.modules);

    for (const effect of AllWin11TasksEffects) {
      effect.definition.id = `${namespace}:${effect.definition.id}`;

      effectManager.registerEffect(
        effect as Effects.EffectType<{ [key: string]: any }>
      );
    }

    //@ts-expect-error ts2339
    runRequest.modules.twitchChat.on("connected", async () => {
      const updateResponse = await checkRemoteVersionAsync();

      if (!updateResponse.newVersionAvailable) return;

      await chatFeedAlert(
        `A new update of Windows Tasks Integration is available (${updateResponse.localVersion} -> ${updateResponse.remoteVersion})! Visit https://github.com/d1r0l/firebot-win11-tasks/releases/latest to download it!`
      );
    });

    logger.info(`Windows Tasks Integration v${version} initialized.`);
  },
};

export default script;
