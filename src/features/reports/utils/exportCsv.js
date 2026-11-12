export function exportToCsv(filename, rows, headers) {
  if (!rows || rows.length === 0) return;

  const separator = ',';
  const keys = headers ? headers.map((h) => h.key) : Object.keys(rows[0]);
  const headerLabels = headers ? headers.map((h) => h.label) : keys;

  const csvContent = [
    headerLabels.join(separator),
    ...rows.map((row) =>
      keys
        .map((key) => {
          let cell = row[key] === null || row[key] === undefined ? '' : row[key];
          cell = cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
          return cell;
        })
        .join(separator)
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
