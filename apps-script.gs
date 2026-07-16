/**
 * Wishlist backend — Google Apps Script Web App.
 * Deploy: Extensions > Apps Script (in your Google Sheet) > paste this file as Code.gs
 * Then Deploy > New deployment > type "Web app" > Execute as "Me" > Who has access "Anyone".
 * Copy the resulting /exec URL into the site's config.js as API_URL.
 *
 * One-time setup after pasting:
 *   1. Run `setAdminPassword` once from the Apps Script editor (select it in the
 *      function dropdown, click Run) to store your admin password in Script Properties.
 *   2. The sheet this script is bound to gets a header row + your items automatically.
 */

const SHEET_NAME = 'Items';

function setAdminPassword() {
  // Change the value below, run this function once, then you can delete/ignore it.
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', 'cam1');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'name', 'note', 'link', 'createdAt']);
  }
  return sheet;
}

function readItems_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1); // drop header
  return rows
    .filter(r => r[0] !== '' && r[0] !== null)
    .map(r => ({
      id: String(r[0]),
      name: String(r[1] || ''),
      note: String(r[2] || ''),
      link: String(r[3] || ''),
    }));
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkPassword_(pw) {
  const expected = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  return expected !== null && pw === expected;
}

function doGet(e) {
  return jsonOut_({ ok: true, items: readItems_() });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut_({ ok: false, error: 'bad_request' });
  }

  const action = body.action;

  if (action === 'login') {
    return jsonOut_({ ok: checkPassword_(body.password) });
  }

  if (action === 'add') {
    if (!checkPassword_(body.password)) return jsonOut_({ ok: false, error: 'unauthorized' });
    const name = String(body.name || '').trim();
    if (!name) return jsonOut_({ ok: false, error: 'missing_name' });
    let link = String(body.link || '').trim();
    if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link;
    const note = String(body.note || '').trim();
    const id = String(Date.now());
    const sheet = getSheet_();
    sheet.appendRow([id, name, note, link, new Date().toISOString()]);
    return jsonOut_({ ok: true, items: readItems_() });
  }

  if (action === 'remove') {
    if (!checkPassword_(body.password)) return jsonOut_({ ok: false, error: 'unauthorized' });
    const id = String(body.id || '');
    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === id) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return jsonOut_({ ok: true, items: readItems_() });
  }

  return jsonOut_({ ok: false, error: 'unknown_action' });
}
