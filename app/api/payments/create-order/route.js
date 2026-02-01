import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import razorpay, { CURRENCY } from '@/lib/razorpay';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'brand') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gigId } = await request.json();

    const supabase = getSupabaseAdmin();
    
    // Get gig details to verify amount and ownership
    const { data: gig } = await supabase
      .from('gigs')
      .select('id, budget, title, brand_id')
      .eq('id', gigId)
      .single();

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    if (gig.brand_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const amount = gig.budget * 100; // Razorpay expects amount in paise

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount,
      currency: CURRENCY,
      receipt: `gig_${gigId}`,
      notes: {
        gigId: gigId,
        brandId: session.user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
