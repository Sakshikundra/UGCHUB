import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { brandProfileSchema, creatorProfileSchema } from '@/lib/validations';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const isBrand = session.user.role === 'brand';
    const table = isBrand ? 'brand_profiles' : 'creator_profiles';

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found" - acceptable for new users
       throw error;
    }

    return NextResponse.json(data || {});
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let role = session.user.role || body.role; // Use session role, or role passed from onboarding
    
    if (!role) {
         return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    const isBrand = role === 'brand';
    
    // Validate based on role
    const schema = isBrand ? brandProfileSchema : creatorProfileSchema;
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.errors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    
    // 1. Check if user exists in DB (for OAuth users who just logged in)
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();
    
    let userId = existingUser?.id;

    // 2. If no user, create one now!
    if (!userId) {
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                email: session.user.email,
                name: session.user.name || 'User',
                role: role,
                email_verified: true, // Trusted from Google
                avatar_url: session.user.image
            })
            .select()
            .single();
        
        if (createError) throw createError;
        userId = newUser.id;
    }

    // 3. Upsert Profile
    const table = isBrand ? 'brand_profiles' : 'creator_profiles';
    const profileData = {
        ...result.data,
        user_id: userId
    };
    
    // Explicitly handle brand vs creator fields if needed, 
    // but the schema validation already filtered 'body' for us mostly.
    // However, we should be careful not to insert 'undefined' fields if not needed.
    
    const { error } = await supabase
      .from(table)
      .upsert(profileData, { onConflict: 'user_id' });

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message || error.toString(),
      hint: error.hint || 'Check server logs'
    }, { status: 500 });
  }
}
