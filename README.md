# Windows Tasks Integration

A Firebot script that adds generic Windows OS-task effects — starting with getting the active (foreground) window's title, with more OS-level tasks planned. Like [firebot-anthropic](https://github.com/d1r0l/firebot-anthropic), it has no knowledge of any other script; effects here just expose OS state as outputs, so they can be chained into any effect list.

OS interaction is done by shelling out to PowerShell (via `-EncodedCommand`) rather than a native Node addon, since Firebot loads scripts into its own bundled Electron/Node process and native modules would need to match its exact ABI to load at all.

## Setup

- In Firebot, go to Settings > Scripts
  - Enable Custom Scripts if not already enabled
  - Click Manage Startup Scripts
  - Click Add New Script
  - Click the "scripts folder" link to open the Scripts Folder and place `win11TasksIntegration.js` there
  - Refresh the list of scripts and pick `win11TasksIntegration.js` from the dropdown
- You now have access to the OS-task effects below in any effect list

## Effects

### Windows: Get Active Window Title

**Inputs:** none

**Outputs**

- `activeWindowTitle` — the title of the currently focused window
- `error` — populated if the request failed

## Development

```
npm install
npm run build       # builds dist/win11TasksIntegration.js
npm run build:dev    # builds and copies into your local Firebot scripts folder
npm test
```
