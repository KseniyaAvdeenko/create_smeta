const { ipcMain } = require('electron');

function toPlain(value) {
  if (value == null) return value;

  if (Array.isArray(value)) {
    return value.map(toPlain);
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value.toJSON === 'function') {
    return toPlain(value.toJSON());
  }

  if (typeof value.get === 'function') {
    return toPlain(value.get({ plain: true }));
  }

  const result = {};
  for (const [key, nested] of Object.entries(value)) {
    result[key] = toPlain(nested);
  }
  return result;
}

function handleIpc(channel, handler) {
  ipcMain.handle(channel, async (event, ...args) => {
    const result = await handler(event, ...args);
    return toPlain(result);
  });
}

module.exports = { toPlain, handleIpc };
