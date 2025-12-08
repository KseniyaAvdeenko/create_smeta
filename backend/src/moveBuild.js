const fs = require('fs-extra');
const path = require('path');

const source = path.join(process.cwd(), '../client/build');
const destination = path.join(__dirname, 'build');
console.log('destination', destination)


async function moveFolder() {
    try {
        // Удаляем старую папку, если она существует
        if (fs.existsSync(destination)) {
            await fs.remove(destination);
        }

        // копируем папку
        await fs.copy(source, destination);
        console.log('✅ Папка успешно скопирована!');
    } catch (err) {
        console.error('❌ Ошибка при копировании папки:', err);
    }
}

moveFolder();