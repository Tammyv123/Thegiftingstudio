// backend/server.ts
import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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


// --- GOOGLE SHEETS SETUP ---
// You need a Service Account JSON from Google Cloud Console
// and share your sheet with the service account email.
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', serviceAccountAuth);

// Route: Log Order to Excel/Google Sheets
app.post('/log-order', async (req, res) => {
  try {
    const { orderDetails, address, total, paymentMethod } = req.body;

    // Load the document info
    await doc.loadInfo();
    
    // Get the first sheet
    const sheet = doc.sheetsByIndex[0];

    // Prepare the row data
    // Make sure your Sheet has these headers in Row 1: 
    // Date, Name, Phone, Address, Items, Total, Payment Method
    const newRow = {
      Date: new Date().toLocaleString('en-IN'),
      Name: address.fullName,
      Phone: address.phone,
      Address: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
      Items: orderDetails, // String of items
      Total: total,
      'Payment Method': paymentMethod
    };

    await sheet.addRow(newRow);

    res.json({ success: true, message: 'Logged to sheet' });
  } catch (error) {
    console.error('Sheet Error:', error);
    // Don't fail the request if sheet logging fails, just log the error
    res.status(500).json({ success: false, message: 'Failed to log to sheet' });
  }
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});