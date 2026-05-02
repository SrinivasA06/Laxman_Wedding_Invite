// Google Apps Script – RSVP endpoint
function doPost(e) {
  try {
    // Guard against missing event
    if (!e) return _textResponse('No data received');

    // Parse payload (form‑urlencoded or JSON)
    const contentType = e?.postData?.type || '';
    let data = {};
    if (contentType.includes('application/json')) {
      data = JSON.parse(e.postData.contents);
    } else {
      const pairs = e.postData.contents.split('&');
      pairs.forEach(p => {
        const [rawKey, rawVal] = p.split('=');
        const key = decodeURIComponent(rawKey);
        const value = decodeURIComponent((rawVal || '').replace(/\+/g, ' '));
        data[key] = value;
      });
    }

    // Build row: Timestamp, Full Name, Email, Attendance, Guests, Message
    const row = [
      new Date(),
      data.name        || '',
      data.email       || '',
      data.attendance  || '',
      data.guests      || '',
      data.message     || ''
    ];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('RSVP'); // adjust if you use another name
    if (!sheet) throw new Error('Sheet named "RSVP" not found.');

    // Ensure the header row exists (Timestamp, Full Name, Email, Attendance, Guests, Message)
    const header = ['Timestamp','Full Name','Email','Attendance','Guests','Message'];
    const firstRow = sheet.getRange(1,1,1,header.length).getValues()[0];
    const hasHeader = header.every((h,i) => firstRow[i] === h);
    if (!hasHeader) {
      sheet.insertRowBefore(1);
      sheet.getRange(1,1,1,header.length).setValues([header]);
    }

    // Append the new RSVP data
    sheet.appendRow(row);

    return _textResponse('Success');
  } catch (err) {
    console.error('RSVP POST error:', err);
    return _textResponse('Error: ' + err.message);
  }
}

function doGet(e) {
  return _textResponse('Ready for POST');
}

function _textResponse(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
