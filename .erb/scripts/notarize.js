const { notarize } = require('@electron/notarize');
const { build } = require('../../package.json');

exports.default = async function notarizeMacos(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (process.env.CI !== 'true') {
    console.warn('Skipping notarizing step. Packaging is not running in CI');
    return;
  }

  if (!('APPLE_API_KEY_ID' in process.env)) {
    console.warn(
      'Skipping notarizing step. APPLE_API_KEY_ID env variable and more (see notarize.js) must be set'
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  await notarize({
    tool: 'notarytool',
    appPath: `${appOutDir}/${appName}.app`,
    appleApiKey:    process.env.APPLE_API_KEY,
    appleApiKeyId:  process.env.APPLE_API_KEY_ID,
    appleApiIssuer: process.env.APPLE_API_KEY_ISSUER_ID,
  });
};
