const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

let loaded = false;

function getEnvPath() {
  try {
    const { app } = require('electron');
    if (app.isPackaged) {
      return path.join(process.resourcesPath, '.env');
    }
  } catch {
    // node-скрипты без electron
  }

  return path.join(process.cwd(), '.env');
}

function loadEnv() {
  if (loaded) return getEnvPath();

  const envPath = getEnvPath();

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }

  loaded = true;
  return envPath;
}

module.exports = { loadEnv, getEnvPath };
