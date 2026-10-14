const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error(
    '[build] backend/.env не найден. Создай файл перед сборкой (см. backend/.env.production.example).',
  );
  process.exit(1);
}

console.log('[build] .env найден, будет включён в extraResource');
