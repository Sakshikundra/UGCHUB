import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data: gigs, error } = await supabase
    .from('gigs')
    .select(`
      *,
      users (
        id,
        email,
        brand_profiles (*)
      )
    `);

  return NextResponse.json({ gigs, error });
}
