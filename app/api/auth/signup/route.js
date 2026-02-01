import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { getSupabaseAdmin } from '@/lib/supabase';
import { signupSchema } from '@/lib/validations';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password, role } = result.data;

    // Verify Supabase Admin client
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash: hashedPassword,
        role,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user - Supabase Details:', createError);
      return NextResponse.json(
        { 
          error: 'Failed to create user account', 
          details: createError.message || createError.code 
        },
        { status: 500 }
      );
    }

    // Create profile based on role
    if (role === 'brand') {
      await supabase.from('brand_profiles').insert({
        user_id: newUser.id,
        company_name: name, // Default to using name as company name initially
      });
    } else {
      await supabase.from('creator_profiles').insert({
        user_id: newUser.id,
        bio: '', // Empty bio for now
      });
    }

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
