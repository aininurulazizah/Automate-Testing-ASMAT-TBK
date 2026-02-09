import * as XLSX from 'xlsx';
import fs from 'fs';

export function exportToExcel(data, fileName, sheetName = 'Sheet1') {

  let workbook;

  if (fs.existsSync(fileName)) {
    workbook = XLSX.readFile(fileName);
  } else {
    workbook = XLSX.utils.book_new();
  }

  if (workbook.SheetNames.includes(sheetName)) {
    delete workbook.Sheets[sheetName];
    workbook.SheetNames = workbook.SheetNames.filter(
      name => name !== sheetName
    );
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, fileName);
}
