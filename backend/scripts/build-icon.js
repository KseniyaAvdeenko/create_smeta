const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '..', 'assets', 'icon.png');
const icoPath = path.join(__dirname, '..', 'assets', 'icon.ico');

async function main() {
  const pngToIco = (await import('png-to-ico')).default;
  const buf = await pngToIco(pngPath);
  fs.writeFileSync(icoPath, buf);
  console.log('written', icoPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
