English | [简体中文](./README-zh_CN.md)

# Ray Service Purchase Demo

## Project Name

Ray Service Purchase Demo

## Usage Notes

This is a paywall/in-app purchase template for Tuya miniapps. Please ensure before use:

- Tuya developer account is registered
- Miniapp application is configured and miniAppId is obtained
- In-app purchase service is enabled
- Understand payment flows for Apple IAP and Google Play Console

## Introduction

A **paywall / in-app purchase template** for Tuya miniapps built with the [Ray framework](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview). It demonstrates a complete purchase flow including SKU display, IAP (Apple / Google) integration, and third-party payment channels.

## Capabilities & Dependencies

| Category         | Technology                                                                              |
| ---------------- | --------------------------------------------------------------------------------------- |
| Framework        | [Ray](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview) (`@ray-js/ray`) |
| Language         | TypeScript                                                                              |
| State Management | [@hookstate/core](https://hookstate.js.org/)                                            |
| UI Components    | [@ray-js/smart-ui](https://developer.tuya.com/material/smartui)                         |
| Build Tool       | [@ray-js/cli](https://developer.tuya.com/en/miniapp/develop/ray/guide/overview)         |

## Features

- Two product page variants (A / B) for A/B testing different purchase layouts
- Apple IAP and Google IAP support with price adaptation
- Third-party payment channels (PayPal, Stripe, Alipay, WeChat Pay, etc.)
- Built-in mock mode for local development without real backend
- i18n support (English & Chinese)

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build

# Lint source files
yarn lint
```

## Project Structure

```
src/
├── app.tsx                  # Application shell & global lifecycle
├── global.config.ts         # App-level config (basename, functionalPages.setting, window style)
├── routes.config.ts         # Page route definitions
├── pages/
│   ├── home/                # Entitlement / landing page
│   ├── product-v1/          # Product page variant A (service-info layout)
│   ├── product-v2/          # Product page variant B (feature showcase + SKU list)
│   └── payment/             # Payment WebView / mock payment page
├── components/
│   ├── NavBarPlus/           # Custom navigation bar with scroll-aware title
│   ├── PaymentModal/         # Payment channel selection modal
│   ├── Card/                 # Card container
│   ├── FooterWrapper/        # Sticky footer wrapper
│   ├── PrimaryBtn/           # Primary action button
│   ├── HeyLogo/              # Brand logo
│   └── Icon/                 # SVG icon set
├── stores/
│   └── pay/                 # Payment store (PayStore.ts) + helpers (format SKU, channels, auto-select)
├── constants/
│   └── index.ts             # Business constants & payment channel config
├── hooks/
│   ├── useSystemContext.ts  # System info context (status bar, theme, language)
│   ├── usePageShow.ts       # Page visibility lifecycle hook
│   └── ...
├── utils/
│   ├── index.ts             # Shared utilities (app info, storage, formatting, i18n helper)
│   ├── payment.ts           # IAP payment helpers
│   ├── navigate.ts          # Navigation utilities
│   ├── currency.ts          # Currency symbol mapping
│   ├── config.ts            # Image CDN config
│   ├── iapPriceAdapter/     # iOS/Google IAP price adaptation
│   └── fetch/               # Highway API wrapper with mock support
├── types/                   # TypeScript type definitions
├── i18n/
│   └── strings.json         # Localization strings (en / zh)
└── static/                  # Images, icons, and global styles
```

## Configuration

Before connecting to real services, update the following constants in `src/constants/index.ts`:

| Constant        | Description               | Default                |
| --------------- | ------------------------- | ---------------------- |
| `CATEGORY_CODE` | Your product catalog code | `"MOCK_CATEGORY_CODE"` |
| `miniAppId`     | Your miniapp ID           | `"<YOUR-MINIAPP-ID>"`  |

When `CATEGORY_CODE` is `"MOCK_CATEGORY_CODE"`, the app runs in **mock mode** — API calls return local mock data and the payment page shows simulated success/failure buttons.

If you don't have a `CATEGORY_CODE` or API authorization yet, submit a support ticket via **Technical Support** on the Tuya Developer Platform.

Replace the `<HIGHWAY-PLACEHOLDER-*>` values in `src/utils/fetch/api.ts` with the Highway API names provided for your miniapp.

Set `functionalPages.setting` in `src/global.config.ts` to your real settings / subscription management route (placeholder: `/pages/setting/index`).

## Pages & Routes

| Route                     | Page       | Description                                                     |
| ------------------------- | ---------- | --------------------------------------------------------------- |
| `/pages/home/index`       | Home       | Entitlement overview & navigation to product pages              |
| `/pages/product-v1/index` | Product V1 | Service-info focused purchase page (auto-selects monthly)       |
| `/pages/product-v2/index` | Product V2 | Feature showcase + SKU list purchase page (auto-selects yearly) |
| `/pages/payment/index`    | Payment    | WebView-based payment gateway (or mock UI)                      |

## Payment Flow

```
Page Entry
  └─> initProduct()
        ├─> initAppInfo()     (parallel)
        ├─> initMallInfo()    (parallel)
        └─> initIap()         (parallel)
              └─> fetchSkuList()
                    └─> adaptIapPrice()
                          └─> autoSelectSku()

User clicks "Buy"
  └─> buyNow()
        ├─ [IAP supported] ─> buyByIap() ─> startIapPay()
        └─ [Third-party]   ─> getPayment() ─> showPayChannel
                                  └─> payNow() ─> preOrder ─> prePay
                                        └─> goToPay() (WebView)
```

## i18n

Localization strings are stored in `src/i18n/strings.json` with `en` and `zh` sections. The `getI18nHelper()` function provides a `t(key, options?)` method with `{{variable}}` template substitution.

## Feature Implementation

### Core Features

- SKU Product Management: Support multi-specification product display
- IAP Payment: Apple App Store and Google Play official payments
- Third-party Payment: Integration with PayPal, Stripe, Alipay, WeChat Pay, etc.
- Order Management: Create orders, query order status
- Price Adaptation: Automatically adjust currency and price based on region

### Extended Features

- A/B Testing: Support switching between two product page layouts
- Mock Mode: No real payment interface needed during development
- Internationalization: Support multiple language switching
- Responsive Design: Adapt to different device screens

## Issue Reporting

If you encounter any issues or have suggestions for improvement, please provide feedback through the following channels:

- Tuya Developer Community: [Community Discussion](https://developer.tuya.com/material/library_oHEKLjj0/component?code=ServicePurchase)

## License

This project is based on the [ISC](https://opensource.org/licenses/ISC) license, feel free to enjoy and participate in open source.

## Changelog

### v0.0.1 (2026-03-26)

- Initial version release
- Implemented SKU display and basic purchase functionality
- Integrated Apple IAP and Google IAP
- Support for third-party payment channels
- Added Mock mode for local development
- Implemented internationalization support
