const path = require('path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

const packagerTmpDir = path.join(__dirname, '..', '.electron-tmp');
const iconPath = path.join(__dirname, 'assets', 'icon');

module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: ['.env'],
    icon: iconPath,
    // temp на том же диске, что и проект — иначе на Windows падает copyfile для sqlite3
    tmpdir: packagerTmpDir,
    ignore: [
      /^\/node_modules\/puppeteer(\/|$)/,
      /^\/node_modules\/puppeteer-core(\/|$)/,
      /^\/node_modules\/@puppeteer(\/|$)/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: path.join(__dirname, 'assets', 'icon.ico'),
        // Ярлыки берут иконку из app.ico, который Squirrel скачивает по iconUrl (не из exe)
        iconUrl: process.env.SQUIRREL_ICON_URL,
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};