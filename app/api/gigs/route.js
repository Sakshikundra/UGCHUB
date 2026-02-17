import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { gigSchema } from '@/lib/validations';

// GET: List gigs (with filters)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const minBudget = searchParams.get('minBudget');
    const limit = searchParams.get('limit') || 20;

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('gigs')
      .select(`
        *,
        users (
          brand_profiles(company_name, verified, industry)
        )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (type) query = query.eq('content_type', type);
    if (minBudget) query = query.gte('budget', minBudget);

    const { data, error } = await query;

    if (error) throw error;
    
    // Flatten structure
    const flattenedData = data.map(gig => ({
      ...gig,
      brand_profiles: gig.users?.brand_profiles
    }));

    return NextResponse.json(flattenedData);
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch gigs',
      details: error.message || error.toString(),
      hint: error.hint || 'Check server logs'
    }, { status: 500 });
  }
}

// POST: Create a new gig
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'brand') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = gigSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.errors }, { status: 400 });
    }

    const { 
      contentType, 
      slotsAvailable, 
      referenceFiles, 
      ...gigData 
    } = result.data;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('gigs')
      .insert({
        ...gigData,
        content_type: contentType,
        slots_available: slotsAvailable,
        reference_files: referenceFiles, // assuming standard naming convention
        brand_id: session.user.id,
        status: 'open',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating gig:', error);
    // Log extended details for debugging
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    return NextResponse.json({ 
      error: 'Failed to create gig', 
      details: error.message || error.code || error.toString(),
      hint: error.hint
    }, { status: 500 });
  }
}
