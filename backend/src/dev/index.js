const dbHandler = require('../ipcHandlers/db.handler');

new dbHandler().getDbConnection().then(r=>console.log(r))