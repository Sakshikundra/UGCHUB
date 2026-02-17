import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing');
}

export const razorpay = new Razorpay({
  key_id: key_id || 'test_key',
  key_secret: key_secret || 'test_secret',
});

export function verifyPaymentSignature({ order_id, payment_id, signature }) {
  const body = order_id + "|" + payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
}

export async function createOrder({ amount, currency = "INR", receipt }) {
  try {
    const options = {
      amount: amount * 100, // Razorpay takes amount in paisa
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay Order Creation Failed:", error);
    throw error;
  }
}
