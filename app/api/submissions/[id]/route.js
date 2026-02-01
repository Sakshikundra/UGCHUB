import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { submissionReviewSchema } from '@/lib/validations';
import { calculatePayout } from '@/lib/utils'; // Assumed utility

// PATCH: Review submission (Approve/Reject)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    // Only brands can review, but we need to verify they own the gig
    if (!session?.user || session.user.role !== 'brand') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = submissionReviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Verify ownership of the gig this submission belongs to
    const { data: submission } = await supabase
      .from('submissions')
      .select('gig_id, gigs(brand_id, budget, title), creator_id')
      .eq('id', params.id)
      .single();

    if (!submission) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    if (submission.gigs.brand_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update submission status
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status: result.data.status,
        feedback: result.data.feedback,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    // Trigger Payout if Approved
    if (result.data.status === 'approved') {
        const payoutAmount = calculatePayout(submission.gigs.budget);
        
        // Record Payout Transaction
        await supabase
          .from('transactions')
          .insert({
            gig_id: submission.gig_id,
            type: 'payout',
            amount: payoutAmount,
            status: 'completed', // Assuming instant "virtual" credit for now
            from_user_id: session.user.id, // technically from platform/escrow
            to_user_id: submission.creator_id,
            description: `Payout for gig: ${submission.gigs.title}`
          });
          
        // Note: Real Razorpay payout via API would happen here in a real production app.
        // For MVP, we just record the ledger entry.
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reviewing submission:', error);
    return NextResponse.json({ error: 'Failed to review submission' }, { status: 500 });
  }
}
