const fs = require('fs-extra');
const path = require('path');

const source = path.join(process.cwd(), '../client/build');
const destination = path.join(__dirname, 'build');
console.log('destination', destination)


async function moveFolder() {
    try {
        if (!fs.existsSync(source)) {
            throw new Error(`client/build не найден. Сначала: cd client && npm run build`);
        }

        if (fs.existsSync(destination)) {
            await fs.remove(destination);
        }

        await fs.copy(source, destination);
        console.log('✅ Папка успешно скопирована!');
    } catch (err) {
        console.error('❌ Ошибка при копировании папки:', err.message || err);
        process.exit(1);
    }
}

moveFolder();