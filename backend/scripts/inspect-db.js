const { Sequelize } = require('sequelize');

const dbPath = process.argv[2] || 'C:/Users/User/AppData/Roaming/smeta/smeta.db';

async function main() {
  const sequelize = new Sequelize({ dialect: 'sqlite', storage: dbPath, logging: false });
  const [tables] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1",
  );
  console.log('DB:', dbPath);
  console.log(
    'tables:',
    tables.map((t) => t.name).join(', ') || '(none)',
  );

  for (const table of [
    'users',
    'measurements',
    'work_category',
    'work',
    'work_measurements',
    'orders',
  ]) {
    try {
      const [rows] = await sequelize.query(`SELECT COUNT(*) as c FROM ${table}`);
      console.log(`${table}:`, rows[0].c);
    } catch (error) {
      console.log(`${table}: ERR ${error.message}`);
    }
  }

  await sequelize.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
