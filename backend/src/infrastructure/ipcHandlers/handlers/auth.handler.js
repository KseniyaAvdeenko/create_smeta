const { ipcMain } = require('electron');
const { requireAuth } = require('../helpers/auth.helper');
const { ensureDbReady } = require('../db.handler');
const { handleIpc } = require('../helpers/serialize.helper');

function registerAuthHandlers({ authService, userRepository, rememberedCredentials }) {
  handleIpc('auth:login', async (_, { login, password, rememberLogin = false }) => {
    await ensureDbReady();
    const result = await authService.login(login, password);

    if (!result.success) return result;

    try {
      if (rememberLogin) {
        await rememberedCredentials.save(login, password);
      } else {
        await rememberedCredentials.clear();
      }
    } catch (error) {
      console.warn('[auth] Не удалось сохранить данные входа:', error.message);
      return {
        ...result,
        rememberError: 'Не удалось безопасно сохранить данные входа на этом устройстве',
      };
    }

    return result;
  });
  ipcMain.handle('auth:logout', async () => authService.logout());
  ipcMain.handle('auth:me', async () => authService.getCurrentUser());
  ipcMain.handle('auth:remembered-login', async () => rememberedCredentials.load());
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
