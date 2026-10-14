const fs = require('fs/promises');
const path = require('path');
const { app, safeStorage } = require('electron');

const FILE_NAME = 'remembered-login.dat';

function getCredentialsPath() {
  return path.join(app.getPath('userData'), FILE_NAME);
}

async function load() {
  if (!safeStorage.isEncryptionAvailable()) return null;

  try {
    const stored = JSON.parse(await fs.readFile(getCredentialsPath(), 'utf8'));
    const credentials = JSON.parse(
      safeStorage.decryptString(Buffer.from(stored.encrypted, 'base64')),
    );

    if (
      typeof credentials.login !== 'string' ||
      typeof credentials.password !== 'string'
    ) {
      throw new Error('Некорректный формат сохранённых данных входа');
    }

    return credentials;
  } catch (error) {
    if (error.code === 'ENOENT') return null;

    await clear().catch(() => {});
    return null;
  }
}

async function save(login, password) {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('В системе недоступно безопасное шифрование данных');
  }

  const credentialsPath = getCredentialsPath();
  const encrypted = safeStorage
    .encryptString(JSON.stringify({ login, password }))
    .toString('base64');
  const temporaryPath = `${credentialsPath}.${process.pid}.tmp`;

  await fs.mkdir(path.dirname(credentialsPath), { recursive: true });

  try {
    await fs.writeFile(temporaryPath, JSON.stringify({ encrypted }), {
      encoding: 'utf8',
      mode: 0o600,
    });
    await fs.rename(temporaryPath, credentialsPath);
  } catch (error) {
    await fs.rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function clear() {
  await fs.rm(getCredentialsPath(), { force: true });
}

module.exports = { load, save, clear };