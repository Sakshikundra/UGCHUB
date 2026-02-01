import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

// GET: Get single gig details
export async function GET(request, { params }) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('gigs')
      .select(`
        *,
        brand_profiles(company_name, verified, website, industry, description),
        submissions(count)
      `)
      .eq('id', params.id)
      .single();

    if (error) return NextResponse.json({ error: 'Gig not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update gig
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    const supabase = getSupabaseAdmin();
    
    // Check ownership
    const { data: gig } = await supabase
      .from('gigs')
      .select('brand_id')
      .eq('id', params.id)
      .single();

    if (!gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    
    if (session?.user?.id !== gig.brand_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { data, error } = await supabase
      .from('gigs')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gig' }, { status: 500 });
  }
}

// DELETE: Delete gig
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    const supabase = getSupabaseAdmin();
    
    const { data: gig } = await supabase
      .from('gigs')
      .select('brand_id')
      .eq('id', params.id)
      .single();

    if (!gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    
    if (session?.user?.id !== gig.brand_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('gigs')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Gig deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gig' }, { status: 500 });
  }
}
