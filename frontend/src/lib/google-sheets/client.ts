/**
 * Google Sheets Client
 * 
 * Server-side client for interacting with Google Sheets API.
 * This should only be used in API routes or server components.
 */

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

let sheets: any = null;
let spreadsheetId: string | null = null;

function getGoogleSheetsClient() {
  if (sheets && spreadsheetId) {
    return { sheets, spreadsheetId };
  }

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || null;

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      'Missing Google Sheets configuration. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SPREADSHEET_ID environment variables.'
    );
  }

  const auth = new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });

  return { sheets, spreadsheetId };
}

export async function readSheet(range: string) {
  try {
    const { sheets, spreadsheetId: id } = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    throw error;
  }
}

export async function appendToSheet(range: string, values: any[][]) {
  try {
    const { sheets, spreadsheetId: id } = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
}

export async function updateSheet(range: string, values: any[][]) {
  try {
    const { sheets, spreadsheetId: id } = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating Google Sheets:', error);
    throw error;
  }
}













