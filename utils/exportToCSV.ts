import Papa from 'papaparse';

export function exportToCSV(csvData: string) {
  try {
    let currentDate = new Date();

    let filename = 'billings_' + Math.floor(currentDate.getTime() / 1000) + '.csv';

    let parsedData = Papa.parse(csvData);

    let csv = Papa.unparse(parsedData?.data);

    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    let link = document.createElement('a');
    if (link.download !== undefined) {
      let url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {}
}
