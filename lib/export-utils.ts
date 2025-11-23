import type { CalendarEntry, BusinessProfile } from './types';
import { format } from 'date-fns';

/**
 * Formats date for CSV export (DD/MM/YYYY)
 */
export function formatDateForCSV(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

/**
 * Formats date for iCal export (YYYYMMDD)
 */
export function formatDateForICal(date: Date): string {
  return format(date, 'yyyyMMdd');
}

/**
 * Escapes CSV text by wrapping in quotes if contains commas or quotes
 */
export function escapeCSV(text: string): string {
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Generates filename with current date
 */
export function generateFilename(type: 'csv' | 'pdf' | 'ical'): string {
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  return `compliance-calendar-${dateStr}.${type}`;
}

/**
 * Triggers file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports calendar to CSV format
 */
export function exportToCSV(
  calendar: CalendarEntry[],
  businessProfile?: BusinessProfile
): void {
  try {
    const lines: string[] = [];

    // Add business profile info as comments
    if (businessProfile) {
      lines.push('# Business Profile');
      lines.push(`# Type: ${businessProfile.businessType}`);
      lines.push(`# State: ${businessProfile.state}`);
      lines.push(`# Industry: ${businessProfile.industry}`);
      lines.push(`# Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`);
      lines.push('');
    }

    // CSV Header
    lines.push(
      'Compliance,Form,Due Date,Priority,Category,Penalty,Description'
    );

    // CSV Rows
    calendar.forEach((entry) => {
      const row = [
        escapeCSV(entry.complianceName),
        escapeCSV(entry.formName),
        formatDateForCSV(entry.dueDate),
        escapeCSV(entry.priority),
        escapeCSV(entry.category),
        escapeCSV(entry.penalty),
        escapeCSV(entry.description),
      ];
      lines.push(row.join(','));
    });

    const csvContent = lines.join('\n');
    const filename = generateFilename('csv');
    downloadFile(csvContent, filename, 'text/csv');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export CSV. Please try again.');
  }
}

/**
 * Exports calendar to PDF using browser print API
 */
export function exportToPDF(
  calendar: CalendarEntry[],
  businessProfile?: BusinessProfile
): void {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups and try again.');
    }

    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Compliance Calendar</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #1e40af;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 10px;
            }
            .profile-info {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #1e40af;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .priority-high { color: #dc2626; font-weight: bold; }
            .priority-medium { color: #d97706; }
            .priority-low { color: #16a34a; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Compliance Calendar</h1>
    `;

    if (businessProfile) {
      html += `
        <div class="profile-info">
          <h2>Business Profile</h2>
          <p><strong>Type:</strong> ${businessProfile.businessType}</p>
          <p><strong>State:</strong> ${businessProfile.state}</p>
          <p><strong>Industry:</strong> ${businessProfile.industry}</p>
          <p><strong>Generated:</strong> ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
        </div>
      `;
    }

    html += `
          <table>
            <thead>
              <tr>
                <th>Compliance</th>
                <th>Form</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Penalty</th>
              </tr>
            </thead>
            <tbody>
    `;

    calendar.forEach((entry) => {
      const priorityClass = `priority-${entry.priority.toLowerCase()}`;
      html += `
        <tr>
          <td>${entry.complianceName}</td>
          <td>${entry.formName}</td>
          <td>${formatDateForCSV(entry.dueDate)}</td>
          <td class="${priorityClass}">${entry.priority}</td>
          <td>${entry.category}</td>
          <td>${entry.penalty}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close window after printing (optional)
        // printWindow.close();
      }, 250);
    };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
}

/**
 * Exports single entry to Google Calendar
 */
export function exportToGoogleCalendar(entry: CalendarEntry): void {
  try {
    const title = encodeURIComponent(`${entry.complianceName} - ${entry.formName}`);
    const startDate = formatDateForICal(entry.dueDate);
    const endDate = formatDateForICal(entry.dueDate);
    
    // Google Calendar uses YYYYMMDDTHHmmss format, but we'll use all-day event
    const dates = `${startDate}/${endDate}`;
    
    const description = encodeURIComponent(
      `Description: ${entry.description}\n\nPenalty: ${entry.penalty}\n\nCategory: ${entry.category}`
    );
    
    const location = entry.resources && entry.resources.length > 0
      ? encodeURIComponent(entry.resources[0].url)
      : '';

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${description}&location=${location}`;
    
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error exporting to Google Calendar:', error);
    throw new Error('Failed to export to Google Calendar. Please try again.');
  }
}

/**
 * Exports calendar to iCal format (.ics file)
 */
export function exportToICal(calendar: CalendarEntry[]): void {
  try {
    const lines: string[] = [];

    // iCal Header
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//SME Compliance Tracker//EN');
    lines.push('CALSCALE:GREGORIAN');
    lines.push('METHOD:PUBLISH');

    // Add each entry as an event
    calendar.forEach((entry) => {
      const uid = `${entry.id}@smetracker.com`;
      const dtstamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
      const dtstart = formatDateForICal(entry.dueDate);
      const summary = `${entry.complianceName} - ${entry.formName}`;
      const description = `Description: ${entry.description}\\n\\nPenalty: ${entry.penalty}\\n\\nCategory: ${entry.category}`;
      const location = entry.resources && entry.resources.length > 0
        ? entry.resources[0].url
        : '';

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(`DTSTART;VALUE=DATE:${dtstart}`);
      lines.push(`DTEND;VALUE=DATE:${dtstart}`);
      lines.push(`SUMMARY:${summary}`);
      lines.push(`DESCRIPTION:${description}`);
      if (location) {
        lines.push(`LOCATION:${location}`);
      }
      lines.push('STATUS:CONFIRMED');
      lines.push('SEQUENCE:0');
      // Reminder 1 week before
      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-P7D');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${summary} is due in 7 days`);
      lines.push('END:VALARM');
      // Reminder 1 day before
      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-P1D');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${summary} is due tomorrow`);
      lines.push('END:VALARM');
      lines.push('END:VEVENT');
    });

    // iCal Footer
    lines.push('END:VCALENDAR');

    const icalContent = lines.join('\r\n');
    const filename = generateFilename('ical');
    downloadFile(icalContent, filename, 'text/calendar');
  } catch (error) {
    console.error('Error exporting to iCal:', error);
    throw new Error('Failed to export iCal file. Please try again.');
  }
}

