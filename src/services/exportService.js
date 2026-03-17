/**
 * Data export service for Streak Maintainer
 * Allows users to export their streaks in CSV and JSON formats
 */

export const exportService = {
  /**
   * Export streaks as CSV
   * @param {Array} streaks - Array of streak objects
   * @param {string} filename - Output filename
   */
  exportToCSV: (streaks, filename = 'streaks-export.csv') => {
    if (!streaks || streaks.length === 0) {
      throw new Error('No streaks to export');
    }

    // CSV Header
    const headers = [
      'Name',
      'Category',
      'Frequency',
      'Current Streak',
      'Best Streak',
      'Total Check-ins',
      'Freezes Left',
      'Created Date',
      'Last Check-in'
    ];

    // Convert streaks to CSV rows
    const rows = streaks.map(streak => [
      `"${streak.name.replace(/"/g, '""')}"`, // Escape quotes
      streak.category,
      streak.frequency,
      streak.currentCount || 0,
      streak.bestCount || 0,
      streak.checkIns?.length || 0,
      streak.freezesLeft || 0,
      streak.createdAt ? new Date(streak.createdAt).toLocaleDateString() : '',
      streak.lastCheckIn ? new Date(streak.lastCheckIn).toLocaleDateString() : 'Never',
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  },

  /**
   * Export streaks as JSON
   * @param {Array} streaks - Array of streak objects
   * @param {string} filename - Output filename
   */
  exportToJSON: (streaks, filename = 'streaks-export.json') => {
    if (!streaks || streaks.length === 0) {
      throw new Error('No streaks to export');
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      totalStreaks: streaks.length,
      streaks: streaks.map(streak => ({
        id: streak.id,
        name: streak.name,
        emoji: streak.emoji,
        category: streak.category,
        frequency: streak.frequency,
        currentCount: streak.currentCount || 0,
        bestCount: streak.bestCount || 0,
        checkIns: streak.checkIns || [],
        freezesLeft: streak.freezesLeft || 0,
        reminderTime: streak.reminderTime,
        targetCount: streak.targetCount,
        createdAt: streak.createdAt,
        lastCheckIn: streak.lastCheckIn,
        archived: streak.archived || false,
      }))
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
  },

  /**
   * Export streaks as PDF (requires print)
   * @param {Array} streaks - Array of streak objects
   */
  exportToPDF: (streaks) => {
    if (!streaks || streaks.length === 0) {
      throw new Error('No streaks to export');
    }

    // Create HTML table
    let html = `
      <html>
        <head>
          <title>Streak Maintainer - Export</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              color: #333;
              margin: 20px;
            }
            h1 { 
              text-align: center; 
              color: #f97316;
              margin-bottom: 5px;
            }
            .export-date {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-bottom: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse;
              margin-top: 20px;
            }
            thead {
              background-color: #f3f4f6;
            }
            th, td { 
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              font-weight: bold;
              background-color: #f3f4f6;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .emoji {
              font-size: 20px;
              margin-right: 5px;
            }
            .badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .badge-best {
              background-color: #fef3c7;
              color: #92400e;
            }
            @media print {
              body { margin: 0; }
              table { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>🔥 Streak Maintainer - Export Report</h1>
          <div class="export-date">Generated on ${new Date().toLocaleString()}</div>
          <table>
            <thead>
              <tr>
                <th>Streak</th>
                <th>Category</th>
                <th>Current</th>
                <th>Best</th>
                <th>Check-ins</th>
                <th>Freezes</th>
                <th>Last Check-in</th>
              </tr>
            </thead>
            <tbody>
    `;

    streaks.forEach(streak => {
      html += `
        <tr>
          <td><span class="emoji">${streak.emoji}</span>${streak.name}</td>
          <td>${streak.category}</td>
          <td><strong>${streak.currentCount || 0}</strong></td>
          <td><span class="badge badge-best">${streak.bestCount || 0}</span></td>
          <td>${streak.checkIns?.length || 0}</td>
          <td>${streak.freezesLeft || 0}</td>
          <td>${streak.lastCheckIn ? new Date(streak.lastCheckIn).toLocaleDateString() : 'Never'}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write(html);
    printWindow.document.close();
  },

  /**
   * Create statistics summary
   * @param {Array} streaks - Array of streak objects
   * @returns {Object} Statistics object
   */
  generateStatistics: (streaks) => {
    if (!streaks || streaks.length === 0) {
      return {
        totalStreaks: 0,
        activeStreaks: 0,
        totalCheckIns: 0,
        averageCheckIns: 0,
        bestStreak: 0,
        totalFreezes: 0,
      };
    }

    const totalCheckIns = streaks.reduce((sum, s) => sum + (s.checkIns?.length || 0), 0);
    const bestStreak = Math.max(...streaks.map(s => s.bestCount || 0));
    const totalFreezes = streaks.reduce((sum, s) => sum + (s.freezesLeft || 0), 0);
    const activeStreaks = streaks.filter(s => s.currentCount > 0).length;

    return {
      totalStreaks: streaks.length,
      activeStreaks,
      totalCheckIns,
      averageCheckIns: totalCheckIns / streaks.length,
      bestStreak,
      totalFreezes,
      exportDate: new Date().toISOString(),
    };
  }
};

/**
 * Helper function to download file
 */
const downloadFile = (content, filename, mimeType) => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:${mimeType},${encodeURIComponent(content)}`
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export default exportService;
