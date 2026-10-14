const { requireAuth } = require('../helpers/auth.helper');
const { handleIpc } = require('../helpers/serialize.helper');

function registerUserSettingsHandlers({ authService, userSettingsRepository }) {
  handleIpc('userSettings:get', async () => {
    const user = requireAuth(authService);
    return userSettingsRepository.getByUserId(user.id);
  });

  handleIpc('userSettings:update', async (_, data) => {
    const user = requireAuth(authService);
    return userSettingsRepository.upsertByUserId(user.id, data);
  });
}

module.exports = registerUserSettingsHandlers;
