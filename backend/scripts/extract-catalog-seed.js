const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const SOURCE = path.join(__dirname, '..', 'Копия Нововиленская 57.xlsx');
const OUT = path.join(__dirname, '..', 'src', 'db', 'seed', 'defaultCatalog.json');

function cellValue(cell) {
  const v = cell?.value;
  if (v == null) return '';
  if (typeof v === 'object' && v.richText) return v.richText.map((t) => t.text).join('');
  return String(v).trim();
}

function parsePrice(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return value;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SOURCE);
  const ws = wb.worksheets[0];

  const categories = [];
  const works = [];
  let currentCategory = null;

  for (let row = 2; row <= ws.rowCount; row += 1) {
    const name = cellValue(ws.getCell(row, 1));
    if (!name || name === 'Итого:') continue;

    const cols2to7 = [2, 3, 4, 5, 6, 7].map((col) => cellValue(ws.getCell(row, col)));
    const allSame = cols2to7.every((v) => v === name);
    const allEmpty = cols2to7.every((v) => !v);

    if (allSame || allEmpty) {
      currentCategory = name;
      if (!categories.includes(name)) categories.push(name);
      continue;
    }

    if (!currentCategory) continue;

    const priceM2 = parsePrice(ws.getCell(row, 4).value);
    const priceMp = parsePrice(ws.getCell(row, 5).value);
    const prices = [];

    if (priceM2 != null) prices.push({ unit: 'm2', cost: priceM2 });
    if (priceMp != null) prices.push({ unit: 'mp', cost: priceMp });

    if (!prices.length) continue;

    works.push({ category: currentCategory, name, prices });
  }

  const payload = {
    measurements: [
      { shortName: 'м²', fullName: 'Метр квадратный (площадь)' },
      { shortName: 'м. п.', fullName: 'Метр погонный' },
    ],
    categories,
    works,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`categories: ${categories.length}, works: ${works.length} -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
