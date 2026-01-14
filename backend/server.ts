// backend/server.ts
import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

import { google } from 'googleapis';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Route 1: Create an Order
app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Razorpay takes amount in paise (500 * 100 = 50000 paise = ₹500)
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

// Route 2: Verify Payment
app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

// --- GOOGLE SHEETS SETUP ---
// You need a Service Account JSON from Google Cloud Console
// and share your sheet with the service account email.
let sheetsClient: any = null;
async function initSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.warn('Google Sheets: Missing env vars (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY)');
    return;
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
    // quick test: get spreadsheet meta (optional)
    const meta = await sheetsClient.spreadsheets.get({ spreadsheetId });
    console.log(`Google Sheets connected: ${meta.data.properties?.title || spreadsheetId}`);
  } catch (err) {
    console.error('Failed to initialize Google Sheets (googleapis):', err);
  }
}

initSheetsClient();

// Route: Log Order to Excel/Google Sheets
app.post('/log-order', async (req, res) => {
  try {
    const { orderDetails, address, total, paymentMethod } = req.body;
    if (!sheetsClient) {
      console.warn('Sheets client not initialized; cannot log order');
      return res.json({ success: false, error: 'Sheets not configured' });
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
    const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

    const row = [
      new Date().toLocaleString('en-IN'),
      address?.fullName || '',
      address?.phone || '',
      `${address?.address || ''}, ${address?.city || ''}, ${address?.state || ''} - ${address?.pincode || ''}`,
      typeof orderDetails === 'string' ? orderDetails : JSON.stringify(orderDetails),
      total,
      paymentMethod,
    ];

    await sheetsClient.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1:G1`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });

    console.log('Logged order to Sheets');
    res.json({ success: true });
  } catch (error) {
    console.error('Sheet Error:', error);
    // We send 200 OK anyway so the frontend doesn't crash if Excel is down
    res.json({ success: false, error: 'Sheet update failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});