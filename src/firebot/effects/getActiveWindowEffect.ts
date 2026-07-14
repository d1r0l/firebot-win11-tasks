import { getActiveWindowTitleAsync } from "@/utils/os";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { logger } from "@oceanity/firebot-helpers/firebot";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";

type EffectParams = Record<string, never>;

export const GetActiveWindowEffect: Firebot.EffectType<EffectParams> = {
  definition: {
    id: "get-active-window",
    name: "Windows: Get Active Window Title",
    description:
      "Gets the title of the currently focused (foreground) window. Chain this with any other script's effects by feeding its output in as their input.",
    icon: "fas fa-window-maximize",
    categories: ["integrations"],
    outputs: [
      {
        label: "Active Window Title",
        description: "The title of the currently focused window.",
        defaultName: "activeWindowTitle",
      },
      {
        label: "Error Message",
        description: "If the request failed, contains an error message.",
        defaultName: "error",
      },
    ],
  },

  optionsTemplate: `
      <eos-container header="Windows: Get Active Window Title" pad-top="true">
        <p>Gets the title of the currently focused window. No configuration needed.</p>
      </eos-container>
    `,

  // @ts-expect-error ts6133: Variables must be named consistently
  optionsController: ($scope: EffectScope<EffectParams>) => {},

  optionsValidator: () => {
    return [];
  },

  onTriggerEvent: async () => {
    try {
      const activeWindowTitle = await getActiveWindowTitleAsync();

      logger.info(`Active window title: ${activeWindowTitle}`);

      return {
        success: true,
        outputs: {
          activeWindowTitle,
          error: "",
        },
      };
    } catch (error) {
      return {
        success: false,
        outputs: {
          activeWindowTitle: "",
          error: getErrorMessage(error),
        },
      };
    }
  },
};
