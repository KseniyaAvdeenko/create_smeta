const { loadEnv } = require('./env');
loadEnv();

/**
 * @param {{ storage?: string }} [overrides]
 * @returns {{ dialect: 'sqlite', storage: string }}
 */
function getDatabaseConfig(overrides = {}) {
  return {
    dialect: 'sqlite',
    storage: overrides.storage || process.env.DB_STORAGE || 'smeta.db',
  };
}

module.exports = { getDatabaseConfig };
