import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      gigId
    } = await request.json();

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Record Transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        gig_id: gigId,
        type: 'escrow_deposit',
        amount: 0, // Need to fetch from gig or pass it securely? relying on gig budget below
        status: 'completed',
        payment_id: razorpay_payment_id,
        from_user_id: session.user.id,
      })
      .select()
      .single();

    if (txError) throw txError;

    // 2. Fetch gig to get amount for transaction update if needed, but more importantly:
    // 3. Update Gig Status to 'open' (if it was pending payment) or keep it open
    // Ideally, gigs are 'draft' until paid. Assuming 'open' means paid and live.
    
    // Let's update the transaction with the actual amount from the gig
    const { data: gig } = await supabase.from('gigs').select('budget').eq('id', gigId).single();
    
    if (gig) {
       await supabase
        .from('transactions')
        .update({ amount: gig.budget })
        .eq('id', transaction.id);
        
       // Also mark gig as "funded" or just ensure it is 'open'
       await supabase
        .from('gigs')
        .update({ status: 'open' }) // formally activating the gig
        .eq('id', gigId);
    }

    return NextResponse.json({ success: true, transactionId: transaction.id });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
