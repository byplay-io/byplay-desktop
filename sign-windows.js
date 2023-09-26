const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const TEMP_DIR = path.join(__dirname, 'release', 'temp');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

function sign(configuration) {
  console.log('sign.js - Signing file');
  // credentials from ssl.com
  const CODE_SIGN_PATH = process.env.WINDOWS_CODE_SIGN_PATH;
  const USER_NAME = process.env.WINDOWS_SIGN_USER_NAME;
  const USER_PASSWORD = process.env.WINDOWS_SIGN_USER_PASSWORD;
  const CREDENTIAL_ID = process.env.WINDOWS_SIGN_CREDENTIAL_ID;
  const USER_TOTP = process.env.WINDOWS_SIGN_USER_TOTP;
  if (
    CODE_SIGN_PATH !== undefined &&
    USER_NAME !== undefined &&
    USER_PASSWORD !== undefined &&
    USER_TOTP !== undefined &&
    CREDENTIAL_ID !== undefined
  ) {
    console.log(`Signing ${configuration.path}`);
    const {name, dir} = path.parse(configuration.path);
    // CodeSignTool can't sign in place without verifying the overwrite with a
    // y/m interaction so we are creating a new file in a temp directory and
    // then replacing the original file with the signed file.
    const tempFile = path.join(TEMP_DIR, name);
    const setDir = `cd ${CODE_SIGN_PATH}`;
    const signFile = `CodeSignTool sign -input_file_path="${configuration.path}" -output_dir_path="${TEMP_DIR}" -credential_id="${CREDENTIAL_ID}" -username="${USER_NAME}" -password="${USER_PASSWORD}" -totp_secret="${USER_TOTP}"`;
    const moveFile = `mv "${tempFile}" "${dir}"`;
    childProcess.execSync(`${setDir} && ${signFile} && ${moveFile}`, {
      stdio: 'inherit',
    });
    console.log('Signed file I guess');
  } else {
    console.warn(
      `sign.js - Can't sign file ${configuration.path}, missing value for: ${
        USER_NAME ? '' : 'WINDOWS_SIGN_USER_NAME'
      } ${USER_PASSWORD ? '' : 'WINDOWS_SIGN_USER_PASSWORD'} ${
        CREDENTIAL_ID ? '' : 'WINDOWS_SIGN_CREDENTIAL_ID'
      } ${USER_TOTP ? '' : 'WINDOWS_SIGN_USER_TOTP'} `,
    );
    process.exit(1);
  }
}

exports.default = sign;
