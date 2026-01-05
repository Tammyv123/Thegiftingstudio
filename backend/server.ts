// backend/server.ts
import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});