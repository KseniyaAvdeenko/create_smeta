const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const repoRoot = path.join(root, '..');
const tmpDir = path.join(repoRoot, '.electron-tmp');
const outDir = path.join(root, 'out');
const iconPath = path.join(root, 'assets', 'icon.ico');

function startIconServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((_req, res) => {
      try {
        const data = fs.readFileSync(iconPath);
        res.writeHead(200, {
          'Content-Type': 'image/x-icon',
          'Content-Length': data.length,
        });
        res.end(data);
      } catch (error) {
        res.writeHead(500);
        res.end();
      }
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}/icon.ico` });
    });
  });
}

async function main() {
  if (!fs.existsSync(iconPath)) {
    console.error('[build] Не найден backend/assets/icon.ico — запусти: node scripts/build-icon.js');
    process.exit(1);
  }

  for (const dir of [tmpDir, outDir]) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(tmpDir, { recursive: true });

  require('./ensure-env.js');

  const { server, url } = await startIconServer();
  console.log(`[build] Squirrel iconUrl: ${url}`);

  const env = {
    ...process.env,
    NODE_ENV: 'prod',
    SQUIRREL_ICON_URL: url,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--max-old-space-size=8192'].filter(Boolean).join(' '),
    TMP: tmpDir,
    TEMP: tmpDir,
    TMPDIR: tmpDir,
  };

  const command = process.argv[2] === 'package' ? 'package' : 'make';

  const result = spawnSync(`npx electron-forge ${command}`, {
    cwd: root,
    env,
    stdio: 'inherit',
    shell: true,
  });

  server.close();
  process.exit(result.status ?? 1);
}

main().catch((error) => {
  console.error('[build]', error);
  process.exit(1);
});
