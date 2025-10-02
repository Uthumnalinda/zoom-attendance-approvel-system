const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate PDF attendance report
async function generateAttendanceReport(meeting, attendanceData, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      // Pipe to file
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Add title
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text('Attendance Report', { align: 'center' });

      doc.moveDown();

      // Add meeting details
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(`Meeting: ${meeting.title || 'Zoom Meeting'}`);
      
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Date: ${new Date(meeting.date).toLocaleDateString()}`)
         .text(`Meeting ID: ${meeting.meeting_id || 'N/A'}`)
         .text(`Zoom Link: ${meeting.zoom_link}`);

      doc.moveDown();

      // Add summary
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text(`Total Students Present: ${attendanceData.length}`);

      doc.moveDown(1.5);

      // Table headers
      const tableTop = doc.y;
      const colPositions = {
        no: 50,
        name: 90,
        username: 220,
        joinTime: 320,
        leaveTime: 400,
        duration: 480
      };

      doc.fontSize(10)
         .font('Helvetica-Bold');

      doc.text('No.', colPositions.no, tableTop);
      doc.text('Full Name', colPositions.name, tableTop);
      doc.text('Username', colPositions.username, tableTop);
      doc.text('Join Time', colPositions.joinTime, tableTop);
      doc.text('Leave Time', colPositions.leaveTime, tableTop);
      doc.text('Duration', colPositions.duration, tableTop);

      // Draw line under headers
      doc.moveTo(50, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke();

      doc.moveDown();

      // Table rows
      doc.font('Helvetica')
         .fontSize(9);

      attendanceData.forEach((record, index) => {
        const rowY = doc.y;

        // Check if we need a new page
        if (rowY > 700) {
          doc.addPage();
          doc.y = 50;
        }

        const currentY = doc.y;

        // Format times
        const joinTime = record.join_time ? new Date(record.join_time).toLocaleTimeString() : 'N/A';
        const leaveTime = record.leave_time ? new Date(record.leave_time).toLocaleTimeString() : 'N/A';
        const duration = record.duration ? `${Math.round(record.duration / 60)} min` : '0 min';

        doc.text(`${index + 1}.`, colPositions.no, currentY);
        doc.text(record.full_name || 'Unknown', colPositions.name, currentY, { width: 120 });
        doc.text(record.username || 'N/A', colPositions.username, currentY, { width: 90 });
        doc.text(joinTime, colPositions.joinTime, currentY, { width: 70 });
        doc.text(leaveTime, colPositions.leaveTime, currentY, { width: 70 });
        doc.text(duration, colPositions.duration, currentY, { width: 60 });

        doc.moveDown(0.5);
      });

      // Add footer
      doc.fontSize(8)
         .font('Helvetica')
         .text(
           `Generated on ${new Date().toLocaleString()}`,
           50,
           doc.page.height - 50,
           { align: 'center' }
         );

      // Finalize PDF
      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
}

// Generate quick summary report
function generateSummaryText(meeting, attendanceData) {
  let summary = `Attendance Report\n`;
  summary += `===================\n\n`;
  summary += `Meeting: ${meeting.title || 'Zoom Meeting'}\n`;
  summary += `Date: ${new Date(meeting.date).toLocaleDateString()}\n`;
  summary += `Total Present: ${attendanceData.length}\n\n`;
  
  summary += `Students:\n`;
  attendanceData.forEach((record, index) => {
    const duration = record.duration ? Math.round(record.duration / 60) : 0;
    summary += `${index + 1}. ${record.full_name} (${record.username}) - ${duration} min\n`;
  });

  return summary;
}

module.exports = {
  generateAttendanceReport,
  generateSummaryText
};
