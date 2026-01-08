const ExcelJS = require('exceljs');

class ExcelGenerationService {
  constructor() {
    // Стили для ячеек
    this.headerStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    this.cellStyle = {
      alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    this.numberStyle = {
      alignment: { horizontal: 'right', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    this.categoryStyle = {
      font: { bold: true, size: 11 },
      alignment: { horizontal: 'left', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    this.totalStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'right', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } },
      border: {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' }
      }
    };
  }

  /**
   * Генерация сметы в формате Excel
   * @param {Object} orderData - данные заказа
   * @param {string} orderData.name - название объекта
   * @param {Date} orderData.date - дата сметы
   * @param {Array} orderData.works - массив работ [{category, name, unit, quantity, price}]
   * @returns {Promise<Buffer>} - буфер с Excel файлом
   */
  async generateSmeta(orderData) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Smeta Generator';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Смета', {
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true }
    });

    // Установка ширины колонок
    worksheet.columns = [
      { key: 'num', width: 5 },
      { key: 'name', width: 45 },
      { key: 'unit', width: 10 },
      { key: 'quantity', width: 12 },
      { key: 'price', width: 15 },
      { key: 'total', width: 18 }
    ];

    let currentRow = 1;

    // Заголовок сметы
    currentRow = this._addTitle(worksheet, orderData, currentRow);
    currentRow += 1;

    // Заголовки таблицы
    currentRow = this._addTableHeaders(worksheet, currentRow);

    // Группировка работ по категориям
    const worksByCategory = this._groupWorksByCategory(orderData.works || []);
    
    let grandTotal = 0;

    // Добавление работ по категориям
    for (const [category, works] of Object.entries(worksByCategory)) {
      currentRow = this._addCategoryHeader(worksheet, category, currentRow);
      
      let categoryTotal = 0;
      let workNum = 1;

      for (const work of works) {
        const rowTotal = (work.quantity || 0) * (work.price || 0);
        categoryTotal += rowTotal;

        currentRow = this._addWorkRow(worksheet, {
          num: workNum++,
          name: work.name,
          unit: work.unit || 'шт',
          quantity: work.quantity || 0,
          price: work.price || 0,
          total: rowTotal
        }, currentRow);
      }

      // Итого по категории
      currentRow = this._addCategoryTotal(worksheet, category, categoryTotal, currentRow);
      grandTotal += categoryTotal;
      currentRow += 1;
    }

    // Общий итог
    this._addGrandTotal(worksheet, grandTotal, currentRow);

    // Генерация буфера
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  /**
   * Добавление заголовка сметы
   */
  _addTitle(worksheet, orderData, startRow) {
    const titleRow = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, 6);
    titleRow.getCell(1).value = `СМЕТА`;
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: 'center' };
    titleRow.height = 25;

    startRow++;

    // Адрес
    if (orderData.name) {
      const addressRow = worksheet.getRow(startRow);
      worksheet.mergeCells(startRow, 1, startRow, 6);
      addressRow.getCell(1).value = `Название: ${orderData.name} ${orderData.clientName}`;
      addressRow.getCell(1).font = { size: 12 };
      addressRow.getCell(1).alignment = { horizontal: 'center' };
      startRow++;
    }

    // Дата
    const dateRow = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, 6);
    const dateStr = orderData.date 
      ? new Date(orderData.date).toLocaleDateString('ru-RU') 
      : new Date().toLocaleDateString('ru-RU');
    dateRow.getCell(1).value = `Дата: ${dateStr}`;
    dateRow.getCell(1).font = { size: 11 };
    dateRow.getCell(1).alignment = { horizontal: 'center' };

    return startRow + 1;
  }

  /**
   * Добавление заголовков таблицы
   */
  _addTableHeaders(worksheet, startRow) {
    const headers = ['№', 'Наименование работ', 'Ед.', 'Кол-во', 'Цена', 'Сумма'];
    const headerRow = worksheet.getRow(startRow);
    
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      Object.assign(cell, this.headerStyle);
    });

    headerRow.height = 30;
    return startRow + 1;
  }

  /**
   * Добавление заголовка категории
   */
  _addCategoryHeader(worksheet, categoryName, startRow) {
    const row = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, 6);
    
    const cell = row.getCell(1);
    cell.value = categoryName;
    Object.assign(cell, this.categoryStyle);
    
    row.height = 22;
    return startRow + 1;
  }

  /**
   * Добавление строки с работой
   */
  _addWorkRow(worksheet, workData, startRow) {
    const row = worksheet.getRow(startRow);
    
    // Номер
    const numCell = row.getCell(1);
    numCell.value = workData.num;
    Object.assign(numCell, this.cellStyle);
    numCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Название
    const nameCell = row.getCell(2);
    nameCell.value = workData.name;
    Object.assign(nameCell, this.cellStyle);

    // Единица измерения
    const unitCell = row.getCell(3);
    unitCell.value = workData.unit;
    Object.assign(unitCell, this.cellStyle);
    unitCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Количество
    const qtyCell = row.getCell(4);
    qtyCell.value = workData.quantity;
    Object.assign(qtyCell, this.numberStyle);
    qtyCell.numFmt = '#,##0.00';

    // Цена
    const priceCell = row.getCell(5);
    priceCell.value = workData.price;
    Object.assign(priceCell, this.numberStyle);
    priceCell.numFmt = '#,##0.00 ₽';

    // Сумма
    const totalCell = row.getCell(6);
    totalCell.value = workData.total;
    Object.assign(totalCell, this.numberStyle);
    totalCell.numFmt = '#,##0.00 ₽';

    return startRow + 1;
  }

  /**
   * Добавление итого по категории
   */
  _addCategoryTotal(worksheet, categoryName, total, startRow) {
    const row = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, 5);
    
    const labelCell = row.getCell(1);
    labelCell.value = `Итого по разделу "${categoryName}":`;
    labelCell.font = { bold: true, italic: true };
    labelCell.alignment = { horizontal: 'right', vertical: 'middle' };
    labelCell.border = this.cellStyle.border;

    const totalCell = row.getCell(6);
    totalCell.value = total;
    totalCell.font = { bold: true };
    totalCell.numFmt = '#,##0.00 ₽';
    Object.assign(totalCell, this.numberStyle);

    return startRow + 1;
  }

  /**
   * Добавление общего итога
   */
  _addGrandTotal(worksheet, total, startRow) {
    const row = worksheet.getRow(startRow);
    worksheet.mergeCells(startRow, 1, startRow, 5);
    
    const labelCell = row.getCell(1);
    labelCell.value = 'ИТОГО:';
    Object.assign(labelCell, this.totalStyle);
    labelCell.alignment = { horizontal: 'right', vertical: 'middle' };

    const totalCell = row.getCell(6);
    totalCell.value = total;
    Object.assign(totalCell, this.totalStyle);
    totalCell.numFmt = '#,##0.00 ₽';

    row.height = 25;
    return startRow + 1;
  }

  /**
   * Группировка работ по категориям
   */
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

  /**
   * Генерация сметы из данных заказа с деталями
   * @param {Object} order - заказ из БД
   * @param {Array} orderWorks - работы заказа из БД
   * @returns {Promise<Buffer>}
   */
  async generateSmetaFromOrder(order, orderWorks) {
    const orderData = {
      name: order.name,
      clientName: order.clientName || order.client_name,
      date: order.createdAt || order.created_at || new Date(),
      works: orderWorks.map(ow => ({
        category: ow.categoryName || ow.category_name || ow.category || 'Работы',
        name: ow.workName || ow.work_name || ow.name,
        unit: ow.measurement || ow.unit || 'шт',
        quantity: parseFloat(ow.quantity) || 0,
        price: parseFloat(ow.price) || 0
      }))
    };

    return this.generateSmeta(orderData);
  }

  /**
   * Генерация пустого шаблона сметы
   * @param {string} address - адрес объекта
   * @returns {Promise<Buffer>}
   */
  async generateTemplate(name) {
    const templateData = {
      name: name || '',
      clientName: '',
      date: new Date(),
      works: []
    };

    return this.generateSmeta(templateData);
  }
}

module.exports = new ExcelGenerationService();

