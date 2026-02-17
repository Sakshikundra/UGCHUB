import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing Supabase keys' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Create or get a dummy brand user
    const dummyBrandEmail = 'demo-brand@ugchub.com';
    let brandId;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', dummyBrandEmail)
      .single();

    if (existingUser) {
      brandId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: dummyBrandEmail,
          name: 'Demo Brand',
          role: 'brand',
          email_verified: true,
          avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
        })
        .select()
        .single();
      
      if (userError) throw userError;
      brandId = newUser.id;

      // Create brand profile
      await supabase
        .from('brand_profiles')
        .insert({
          user_id: brandId,
          company_name: 'Demo Brand Inc.',
          industry: 'Technology',
          website: 'https://demo-brand.com',
          description: 'A demo brand showcasing the power of UGCHub.'
        });
    }

    // 2. Insert the 6 featured gigs
    const gigs = [
      {
        title: "Instagram Reels for Skincare Launch",
        description: "Looking for authentic creators to showcase our new moisturizer. Need high-energy, aesthetic reels demonstrating the product application and glow effect.",
        budget: 15000,
        content_type: "Video",
        deadline: "2026-03-15",
        slots_available: 3,
        brand_id: brandId,
        status: 'open'
      },
      {
        title: "Product Unboxing for Tech Gadget",
        description: "Unbox our latest wireless earbuds. Focus on packaging quality, build connection speed, and sound clarity. Honest reviews preferred.",
        budget: 25000,
        content_type: "Video",
        deadline: "2026-03-20",
        slots_available: 2,
        brand_id: brandId,
        status: 'open'
      },
      {
        title: "Lifestyle Photos for Fashion Brand",
        description: "Street style photography featuring our summer collection. Need 5-7 high-res edited photos suitable for Instagram feed and stories.",
        budget: 10000,
        content_type: "Photo",
        deadline: "2026-03-10",
        slots_available: 5,
        brand_id: brandId,
        status: 'open'
      },
      {
        title: "Recipe Video for Health Food Brand",
        description: "Create a 60s recipe video using our organic protein powder. Must be visually appealing and include subtitles for ingredients.",
        budget: 18000,
        content_type: "Video",
        deadline: "2026-03-25",
        slots_available: 4,
        brand_id: brandId,
        status: 'open'
      },
      {
        title: "Review & Testimonial for SaaS App",
        description: "Try our productivity tool for 3 days and record a genuine video testimonial about how it helped your workflow.",
        budget: 8000,
        content_type: "Review",
        deadline: "2026-03-12",
        slots_available: 6,
        brand_id: brandId,
        status: 'open'
      },
      {
        title: "Travel Vlog for Tourism Campaign",
        description: "Vlog your weekend getaway! We sponsor the stay, you capture the experience. Cinematic shots and voiceover required.",
        budget: 35000,
        content_type: "Video",
        deadline: "2026-04-01",
        slots_available: 1,
        brand_id: brandId,
        status: 'open'
      }
    ];

    const { data, error } = await supabase
      .from('gigs')
      .insert(gigs)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, message: `Seeded ${data.length} gigs`, data });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
