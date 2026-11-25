# Ray Official Demo Project

[English](README.md) | [简体中文](README_zh.md)

This project contains rich component examples and API demonstrations to help developers quickly understand and master the usage of the Ray framework.

## Develop in the IDE

Open the project root in a Tuya Miniapp IDE that supports Raypack. The IDE provides Raypack and handles development, preview, and builds.

Use Yarn Classic (1.x) to install the project dependencies from the checked-in `yarn.lock`.

```sh
yarn install --frozen-lockfile
```

Replace the placeholder `projectId` in `project.tuya.json` with your miniapp project ID before previewing on a device or publishing.

## Verify with a local Raypack CLI

If you have a local Raypack CLI available, run these commands from the project root. The CLI requires Node.js 22.12 or later when run with Node.js. Use separate output directories to keep both builds available for inspection.

```sh
raypack check .
raypack repair . --dry-run
raypack build . --ide --output dist/full
raypack build . --ide --sub-packages --output dist/split
```

The main package is written to `dist/full/miniprogram/` for the full build and `dist/split/__APP__/` for the subpackage build.

## 📁 Project Structure

```
├── src/
│   ├── api/                # API example pages
│   ├── basic/              # Basic component examples
│   ├── components/         # Reusable component library
│   ├── pages/              # Page components
│   ├── common/             # Common components
│   ├── utils/              # Utility functions
│   ├── app.tsx             # Application entry
│   ├── global.config.ts     # Global miniapp configuration
│   ├── i18n/strings.ts      # English and Chinese translations
│   └── routes.config.ts    # Route configuration
├── public/                 # Static assets
├── typings/                # Type definitions
├── package.json            # Project configuration
├── project.tuya.json       # Tuya project configuration
└── ray.config.ts           # Raypack configuration
```

## English and Chinese translations

`src/i18n/strings.ts` groups translations under `en` and `zh`. Add the same key to both dictionaries when adding text. In pages, components, and messages, call the global `I18n.t('key')`. In static navigation and tab bar configuration, use `@I18n.t('key')`.

## 🔗 Related Links

- [Ray Official Documentation](https://developer.tuya.com/cn/miniapp/develop/ray/guide/overview?source=platform)
