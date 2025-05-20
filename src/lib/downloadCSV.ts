export function downloadCSV<T extends Record<string, unknown>>(filename: string, rows: T[]) {
  if (rows.length === 0) return
  
    const keys = Object.keys(rows[0])
    const csvContent = [
      keys.join(','), // Header
      ...rows.map((row) =>
        keys.map((k) => `"${String(row[k]).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
  
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.click()
  }
  