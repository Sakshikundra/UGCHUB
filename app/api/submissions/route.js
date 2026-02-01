import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { submissionSchema } from '@/lib/validations';

// POST: Create a new submission
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'creator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = submissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.errors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if already submitted
    const { data: existing } = await supabase
      .from('submissions')
      .select('id')
      .eq('gig_id', result.data.gigId)
      .eq('creator_id', session.user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'You have already submitted to this gig' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('submissions')
      .insert({
        gig_id: result.data.gigId,
        creator_id: session.user.id,
        file_url: result.data.fileUrl,
        thumbnail_url: result.data.thumbnailUrl,
        notes: result.data.notes,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
