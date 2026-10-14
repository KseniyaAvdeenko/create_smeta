const { ipcMain } = require('electron');
const { requireAuth } = require('../helpers/auth.helper');

function registerGdriveHandlers({ authService, gdriveService }) {
  ipcMain.handle('gdrive:status', async () => {
    const user = requireAuth(authService);
    return gdriveService.getStatus(user.id);
  });

  ipcMain.handle('gdrive:connect', async () => {
    const user = requireAuth(authService);
    return gdriveService.connect(user.id);
  });

  ipcMain.handle('gdrive:disconnect', async () => {
    const user = requireAuth(authService);
    return gdriveService.disconnect(user.id);
  });

  ipcMain.handle('gdrive:setDefaultFolder', async (_, defaultFolder) => {
    const user = requireAuth(authService);
    return gdriveService.setDefaultFolder(user.id, defaultFolder);
  });
}

module.exports = registerGdriveHandlers;
