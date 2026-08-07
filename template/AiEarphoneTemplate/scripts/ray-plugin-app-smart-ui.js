/**
 * Register smart-ui native components used by app-level overlays (e.g. DelayedHooksContainer in app.tsx)
 * into every page's usingComponents. Ray only traces imports from each page entry, so
 * components rendered only from app.tsx are otherwise missing on pages like home/recordingMode.
 */
const path = require('path');
const slash = require('slash');
const { md5Hash } = require('@ray-js/raypack/lib/shared/md5Hash');

/** @type {string[]} npm paths under node_modules, without file extension */
const APP_LEVEL_SMART_UI_COMPONENTS = [
  '@tuya-miniapp/smart-ui/dist/checkbox/index',
  '@tuya-miniapp/smart-ui/dist/popup/index',
  '@tuya-miniapp/smart-ui/dist/bottom-sheet/index',
  '@tuya-miniapp/smart-ui/dist/icon/index',
];

const NPM_PUBLIC_PREFIX = '/_npm/';

/**
 * @param {string} cwd
 * @param {string} absolutePath
 * @returns {string}
 */
function getComponentName(cwd, absolutePath) {
  const normalized = slash(absolutePath);
  const segments = normalized.replace(/\.[^/.]+$/, '').split('/');
  const componentName = segments[segments.length - 2];
  const fileName = segments[segments.length - 1];
  const relativePath = slash(path.relative(cwd, normalized));
  const hash = md5Hash(relativePath, 6);
  return `${componentName}-${fileName}-${hash}`;
}

/**
 * @param {string} cwd
 * @param {string} absolutePath
 * @returns {string}
 */
function getNpmOutputPath(cwd, absolutePath) {
  const nodeModulesDir = path.join(cwd, 'node_modules');
  const relativePath = slash(path.relative(nodeModulesDir, absolutePath)).replace(/\.[^/.]+$/, '');
  return `${NPM_PUBLIC_PREFIX}${relativePath}`;
}

/**
 * @param {string} cwd
 * @returns {{ name: string, path: string }[]}
 */
function buildComponentRegistry(cwd) {
  return APP_LEVEL_SMART_UI_COMPONENTS.map(componentPath => {
    const absolutePath = require.resolve(componentPath, { paths: [cwd] });
    return {
      name: getComponentName(cwd, absolutePath),
      path: getNpmOutputPath(cwd, absolutePath),
    };
  });
}

/**
 * @returns {{ name: string, onPageConfig: Function }}
 */
function rayPluginAppSmartUi() {
  /** @type {{ name: string, path: string }[] | null} */
  let registry = null;

  return {
    name: 'ray-plugin-app-smart-ui',
    onPageConfig({ config }) {
      if (!registry) {
        registry = buildComponentRegistry(process.cwd());
      }
      const usingComponents = config.usingComponents || {};
      registry.forEach(({ name, path: componentPath }) => {
        if (!usingComponents[name]) {
          usingComponents[name] = componentPath;
        }
      });
      config.usingComponents = usingComponents;
      return config;
    },
  };
}

module.exports = rayPluginAppSmartUi;
