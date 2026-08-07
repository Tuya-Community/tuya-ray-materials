[English](README.md) | [简体中文](README_zh.md)

## AI Earphone Device Panel

Device-panel project based on the commercial AI Note experience, scoped to **single panel device + phone mic**. Multi-device / home device management is removed.

## Quick Start

1. Apply the **Required config** below
2. `yarn`
3. `yarn start`

## Required Config

Change these first when integrating (business code usually stays untouched):

| Item                     | Location                                            | Notes                                                                                             |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Product PID              | `project.tuya.json` → `productId`                   | Bind to your Tuya product                                                                         |
| Mini-program / panel ID  | `src/constant/index.ts` → `MINI_PROGRAM_ID`         | Shared by mall binding, agent channel, audio source; dev mode warns if still the template default |
| Shop catalogs            | `src/constant/index.ts` → `SHOP_CATALOG`            | Defaults `AI_WEARABLE_BT` / `AI_AUDIO_TRANS` (cloud VAS contract)                                 |
| Custom / public apps     | `CUSTOM_APPS` / `PUBLIC_APPS`                       | Optional appId lists; affect benefit card, guides, etc.                                           |
| Guide videos             | `src/constant/url.ts` → `GUIDE_VIDEO_*`             | Replace with your CDN assets                                                                      |
| Settings functional page | `src/global.config.ts` → `functionalPages.settings` | Required for device panels without custom device detail                                           |

> Default `MINI_PROGRAM_ID` is a sample value. Replace it before production or mall/agent traffic will hit someone else's config.

## Capability Dependencies

- BaseKit 3.0.6 · MiniKit 3.9.8 · DeviceKit 4.14.0 · BizKit 3.9.0 · HomeKit 3.13.1 · WearKit 3.1.0
- baseversion 2.30.23
- @ray-js/ray 1.7.82

### Cloud / backend checklist

- Product linked to this panel; `initDevInfo` works on device
- VAS mall: catalogs + `bindingObjectCode` (= `MINI_PROGRAM_ID`) configured
- Agent channel bound to `MINI_PROGRAM_ID`; `getAgentChannel` returns a value
- Feature switches via `getPopupSwitchConfig` (sub guide, benefit card, …)
- WearKit: recording, offline transfer, floating window, etc. Missing commercial-only bridges are soft-skipped (see `src/api/ttt.ts`)

## Page Map

```
pages/home          Home (history / mine / settings entry)
pages/recordingMode Recording
pages/detail        Detail (transcript / summary / mind map)
pages/btOffline     BT offline
pages/imagePreview  Image preview

pkgEntry            Search / card transfer / batch files
pkgShop             Shop / benefits / auto-renew agreement
pkgSettings         Settings / usage / cloud sync / web / widget
pkgTemplate         Custom templates / more templates / detail
```

## Scope

**Included:** home / recording / detail / settings / templates / shop (VAS), panel `initDevInfo`, phone as recording source.

**Removed:** pkgDevice (devices / activation / smartDevice), home-wide device list sync, multi-device add/remove MQTT.

## License

[License Details](LICENSE)
