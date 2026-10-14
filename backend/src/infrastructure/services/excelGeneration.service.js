const ExcelJS = require('exceljs');

const COL_COUNT = 7;

class ExcelGenerationService {
  constructor() {
    this.headerStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    this.cellStyle = {
      alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    this.numberStyle = {
      alignment: { horizontal: 'right', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    this.categoryStyle = {
      font: { bold: true, size: 11 },
      alignment: { horizontal: 'left', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    this.totalStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'right', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } },
      border: {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      },
    };
  }

  _moneyFormat() {
    return '$#,##0.00';
  }

  _normalizeUnit(unit) {
    return String(unit || '')
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/²/g, '2')
      .replace(/\./g, '');
  }

  _isSquareMeter(unit) {
    const u = this._normalizeUnit(unit);
    return u === 'м2' || u === 'm2' || u.includes('кв') || u === 'квм';
  }

  _isLinearMeter(unit) {
    const u = this._normalizeUnit(unit);
    return u === 'мп' || u === 'mp' || u.includes('пог');
  }

  /**
   * Одна строка на работу: объединяет м² и м.п.
   */
  _aggregateWorks(works) {
    const map = new Map();

    for (const work of works) {
      const category = work.category || work.categoryName || 'Прочие работы';
      const name = work.name || work.workName || '';
      const key = `${category}::${name}`;
      const unit = work.unit || work.measurement || '';
      const qty = parseFloat(work.quantity) || 0;
      const price = parseFloat(work.price) || 0;

      if (!map.has(key)) {
        map.set(key, {
          category,
          name,
          qtyM2: null,
          qtyLinear: null,
          priceM2: null,
          priceLinear: null,
        });
      }

      const row = map.get(key);

      if (this._isSquareMeter(unit)) {
        row.qtyM2 = qty;
        row.priceM2 = price;
      } else if (this._isLinearMeter(unit)) {
        row.qtyLinear = qty;
        row.priceLinear = price;
      } else if (row.qtyM2 == null) {
        row.qtyM2 = qty;
        row.priceM2 = price;
      } else {
        row.qtyLinear = qty;
        row.priceLinear = price;
      }
    }

    return Array.from(map.values()).map(row => ({
      ...row,
      total:
        (row.qtyM2 || 0) * (row.priceM2 || 0) +
        (row.qtyLinear || 0) * (row.priceLinear || 0),
    }));
  }

  async generateSmeta(orderData) {
    const moneyFormat = this._moneyFormat();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Smeta Generator';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Смета', {
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true },
    });

    worksheet.columns = [
      { key: 'num', width: 5 },
      { key: 'name', width: 40 },
      { key: 'qtyM2', width: 12 },
      { key: 'qtyLinear', width: 12 },
      { key: 'priceM2', width: 12 },
      { key: 'priceLinear', width: 12 },
      { key: 'total', width: 16 },
    ];

    let currentRow = 1;
    currentRow = this._addTitle(worksheet, orderData, currentRow);
    currentRow += 1;
    currentRow = this._addTableHeaders(worksheet, currentRow);

    const aggregated = this._aggregateWorks(orderData.works || []);
    const worksByCategory = this._groupWorksByCategory(aggregated);

    let grandTotal = 0;

    for (const [category, works] of Object.entries(worksByCategory)) {
      currentRow = this._addCategoryHeader(worksheet, category, currentRow);

      let categoryTotal = 0;
      let workNum = 1;

      for (const work of works) {
        categoryTotal += work.total || 0;
        currentRow = this._addWorkRow(
          worksheet,
          { num: workNum++, ...work },
          currentRow,
          moneyFormat,
        );
      }

      currentRow = this._addCategoryTotal(worksheet, category, categoryTotal, currentRow, moneyFormat);
      grandTotal += categoryTotal;
      currentRow += 1;
    }

    this._addGrandTotal(worksheet, grandTotal, currentRow, moneyFormat);

    return workbook.xlsx.writeBuffer();
  }

  _addTitle(worksheet, orderData, startRow) {
    const titleRow = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, COL_COUNT);
    titleRow.getCell(1).value = 'СМЕТА';
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: 'center' };
    titleRow.height = 25;

    startRow++;

    if (orderData.name) {
      const addressRow = worksheet.getRow(startRow);
      worksheet.mergeCells(startRow, 1, startRow, COL_COUNT);
      addressRow.getCell(1).value = `Название: ${orderData.name} ${orderData.clientName || ''}`;
      addressRow.getCell(1).font = { size: 12 };
      addressRow.getCell(1).alignment = { horizontal: 'center' };
      startRow++;
    }

    const dateRow = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, COL_COUNT);
    const dateStr = orderData.date
      ? new Date(orderData.date).toLocaleDateString('ru-RU')
      : new Date().toLocaleDateString('ru-RU');
    dateRow.getCell(1).value = `Дата: ${dateStr}`;
    dateRow.getCell(1).font = { size: 11 };
    dateRow.getCell(1).alignment = { horizontal: 'center' };

    return startRow + 1;
  }

  _addTableHeaders(worksheet, startRow) {
    const headers = ['№', 'Наименование работ', 'м²', 'м.п.', 'Цена м²', 'Цена м.п.', 'Сумма'];
    const headerRow = worksheet.getRow(startRow);

    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      Object.assign(cell, this.headerStyle);
    });

    headerRow.height = 30;
    return startRow + 1;
  }

  _addCategoryHeader(worksheet, categoryName, startRow) {
    const row = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, COL_COUNT);

    const cell = row.getCell(1);
    cell.value = categoryName;
    Object.assign(cell, this.categoryStyle);

    row.height = 22;
    return startRow + 1;
  }

  _addWorkRow(worksheet, workData, startRow, moneyFormat = '$#,##0.00') {
    const row = worksheet.getRow(startRow);

    const numCell = row.getCell(1);
    numCell.value = workData.num;
    Object.assign(numCell, this.cellStyle);
    numCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const nameCell = row.getCell(2);
    nameCell.value = workData.name;
    Object.assign(nameCell, this.cellStyle);

    const qtyM2Cell = row.getCell(3);
    qtyM2Cell.value = workData.qtyM2 != null ? workData.qtyM2 : '';
    Object.assign(qtyM2Cell, this.numberStyle);
    qtyM2Cell.numFmt = '#,##0.00';

    const qtyLinearCell = row.getCell(4);
    qtyLinearCell.value = workData.qtyLinear != null ? workData.qtyLinear : '';
    Object.assign(qtyLinearCell, this.numberStyle);
    qtyLinearCell.numFmt = '#,##0.00';

    const priceM2Cell = row.getCell(5);
    priceM2Cell.value = workData.priceM2 != null ? workData.priceM2 : '';
    Object.assign(priceM2Cell, this.numberStyle);
    priceM2Cell.numFmt = moneyFormat;

    const priceLinearCell = row.getCell(6);
    priceLinearCell.value = workData.priceLinear != null ? workData.priceLinear : '';
    Object.assign(priceLinearCell, this.numberStyle);
    priceLinearCell.numFmt = moneyFormat;

    const totalCell = row.getCell(7);
    totalCell.value = workData.total || 0;
    Object.assign(totalCell, this.numberStyle);
    totalCell.numFmt = moneyFormat;

    return startRow + 1;
  }

  _addCategoryTotal(worksheet, categoryName, total, startRow, moneyFormat = '$#,##0.00') {
    const row = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, COL_COUNT - 1);

    const labelCell = row.getCell(1);
    labelCell.value = `Итого по разделу "${categoryName}":`;
    labelCell.font = { bold: true, italic: true };
    labelCell.alignment = { horizontal: 'right', vertical: 'middle' };
    labelCell.border = this.cellStyle.border;

    const totalCell = row.getCell(COL_COUNT);
    totalCell.value = total;
    totalCell.font = { bold: true };
    totalCell.numFmt = moneyFormat;
    Object.assign(totalCell, this.numberStyle);

    return startRow + 1;
  }

  _addGrandTotal(worksheet, total, startRow, moneyFormat = '$#,##0.00') {
    const row = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, COL_COUNT - 1);

    const labelCell = row.getCell(1);
    labelCell.value = 'ИТОГО:';
    Object.assign(labelCell, this.totalStyle);
    labelCell.alignment = { horizontal: 'right', vertical: 'middle' };

    const totalCell = row.getCell(COL_COUNT);
    totalCell.value = total;
    Object.assign(totalCell, this.totalStyle);
    totalCell.numFmt = moneyFormat;

    row.height = 25;
    return startRow + 1;
  }

  _groupWorksByCategory(works) {
    return works.reduce((acc, work) => {
      const category = work.category || 'Прочие работы';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(work);
      return acc;
    }, {});
  }

  async generateSmetaFromOrder(order, orderWorks) {
    const orderData = {
      name: order.name,
      clientName: order.clientName || order.client_name || order.client,
      date: order.createdAt || order.created_at || new Date(),
      works: orderWorks.map(ow => ({
        category: ow.categoryName || ow.category_name || ow.category || 'Работы',
        name: ow.workName || ow.work_name || ow.name,
        unit: ow.measurement || ow.unit || 'шт',
        quantity: parseFloat(ow.quantity) || 0,
        price: parseFloat(ow.price) || 0,
      })),
    };

    return this.generateSmeta(orderData);
  }

  async generateTemplate(name) {
    return this.generateSmeta({
      name: name || '',
      clientName: '',
      date: new Date(),
      works: [],
    });
  }
}

module.exports = new ExcelGenerationService();
