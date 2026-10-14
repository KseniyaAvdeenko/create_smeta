const { ipcMain } = require('electron');
const { requireAuth } = require('../helpers/auth.helper');
const { ensureDbReady } = require('../db.handler');
const { handleIpc } = require('../helpers/serialize.helper');

function registerAuthHandlers({ authService, userRepository }) {
  handleIpc('auth:login', async (_, { login, password }) => {
    await ensureDbReady();
    return authService.login(login, password);
  });
  ipcMain.handle('auth:logout', async () => authService.logout());
  ipcMain.handle('auth:me', async () => authService.getCurrentUser());
  handleIpc('auth:register', async (_, userData) => {
    await ensureDbReady();
    return authService.register(userData);
  });
  ipcMain.handle('auth:hasUsers', async () => {
    await ensureDbReady();
    return authService.hasUsers();
  });
  handleIpc('auth:profile', async () => {
    const user = requireAuth(authService);
    return userRepository.findByIdWithProfile(user.id);
  });
}

module.exports = registerAuthHandlers;
