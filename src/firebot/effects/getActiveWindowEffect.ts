import { getActiveWindowInfoAsync, toObsWindowSelector } from "@/utils/os";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { logger } from "@oceanity/firebot-helpers/firebot";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";

type EffectParams = Record<string, never>;

export const GetActiveWindowEffect: Firebot.EffectType<EffectParams> = {
  definition: {
    id: "get-active-window",
    name: "Windows: Get Active Window Title",
    description:
      "Gets info about the currently focused (foreground) window, including an OBS window_capture-ready selector string. Chain this with any other script's effects by feeding its output in as their input.",
    icon: "fas fa-window-maximize",
    categories: ["integrations"],
    outputs: [
      {
        label: "Active Window Title",
        description: "The title of the currently focused window.",
        defaultName: "activeWindowTitle",
      },
      {
        label: "Active Window Class",
        description: "The window class name of the currently focused window.",
        defaultName: "activeWindowClass",
      },
      {
        label: "Active Window Executable",
        description:
          "The executable file name (e.g. notepad.exe) owning the currently focused window.",
        defaultName: "activeWindowExecutable",
      },
      {
        label: "Active Window OBS Selector",
        description:
          'The "title:class:executable" string OBS\'s window_capture source (raw websocket mode: 1, "capture a specific window") expects for its window input setting.',
        defaultName: "activeWindowObsSelector",
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
        <p>Gets info about the currently focused window. No configuration needed.</p>
      </eos-container>
    `,

  // @ts-expect-error ts6133: Variables must be named consistently
  optionsController: ($scope: EffectScope<EffectParams>) => {},

  optionsValidator: () => {
    return [];
  },

  onTriggerEvent: async () => {
    try {
      const info = await getActiveWindowInfoAsync();

      logger.info(`Active window: ${JSON.stringify(info)}`);

      return {
        success: true,
        outputs: {
          activeWindowTitle: info.title,
          activeWindowClass: info.className,
          activeWindowExecutable: info.executableName,
          activeWindowObsSelector: toObsWindowSelector(info),
          error: "",
        },
      };
    } catch (error) {
      return {
        success: false,
        outputs: {
          activeWindowTitle: "",
          activeWindowClass: "",
          activeWindowExecutable: "",
          activeWindowObsSelector: "",
          error: getErrorMessage(error),
        },
      };
    }
  },
};
