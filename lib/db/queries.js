import { supabase } from '@/lib/supabase';

// ==========================================
// User & Profile Queries
// ==========================================

export async function getUserProfile(userId, role) {
  const table = role === 'brand' ? 'brand_profiles' : 'creator_profiles';
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

// ==========================================
// Gig Queries
// ==========================================

export async function getGigs(filters = {}) {
  let query = supabase
    .from('gigs')
    .select(`
      *,
      users (
        brand_profiles (company_name, verified)
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (filters.contentType) {
    query = query.eq('content_type', filters.contentType);
  }
  
  if (filters.minBudget) {
    query = query.gte('budget', filters.minBudget);
  }
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  try {
    const { data, error } = await query;
    if (error) {
      console.error('getGigs Error:', error);
      return [];
    }
    
    // Transform data to flatten the nested structure
    return data.map(gig => {
      const bp = gig.users?.brand_profiles;
      return {
        ...gig,
        brand_profiles: Array.isArray(bp) ? bp[0] : bp
      };
    });
  } catch (err) {
    console.error('getGigs Exception:', err);
    return [];
  }
}

export async function getGigById(id) {
  try {
    const { data, error } = await supabase
      .from('gigs')
      .select(`
        *,
        users (
          brand_profiles (company_name, verified, website, industry)
        ),
        submissions(count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`getGigById(${id}) Error:`, error);
      return null;
    }
    
    // Transform data
    if (data) {
      const bp = data.users?.brand_profiles;
      return {
        ...data,
        brand_profiles: Array.isArray(bp) ? bp[0] : bp
      };
    }
    return null;
  } catch (err) {
    console.error(`getGigById(${id}) Exception:`, err);
    return null;
  }
}

export async function getBrandGigs(brandId) {
  try {
    const { data, error } = await supabase
      .from('gigs')
      .select(`
        *,
        submissions(count)
      `)
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getBrandGigs Error:', error);
      return [];
    }
    return data;
  } catch (err) {
    console.error('getBrandGigs Exception:', err);
    return [];
  }
}

// ==========================================
// Submission Queries
// ==========================================

export async function getGigSubmissions(gigId) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        users (
          name,
          email,
          avatar_url,
          creator_profiles (portfolio_url, social_handles)
        )
      `)
      .eq('gig_id', gigId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('getGigSubmissions Error:', error);
      return [];
    }
    // Fetch reviews for this gig to attach to submissions
    const { data: reviews } = await supabase
      .from('reviews')
      .select('reviewer_id, reviewee_id, rating, comment')
      .eq('gig_id', gigId);

    // Transform data to flatten structure and attach reviews
    return data.map(sub => {
      const review = reviews?.find(r => r.reviewee_id === sub.creator_id);
      return {
        ...sub,
        users: {
          name: sub.users?.name,
          email: sub.users?.email,
          avatar_url: sub.users?.avatar_url
        },
        creator_profiles: sub.users?.creator_profiles,
        review // Attach review if exists
      };
    });
  } catch (err) {
    console.error('getGigSubmissions Exception:', err);
    return [];
  }
}

export async function getCreatorSubmissions(creatorId) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        gigs(title, budget, status)
      `)
      .eq('creator_id', creatorId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('getCreatorSubmissions Error:', error);
      return [];
    }
    return data;
  } catch (err) {
    console.error('getCreatorSubmissions Exception:', err);
    return [];
  }
}

// ==========================================
// Stats Queries
// ==========================================

export async function getBrandStats(brandId) {
  const { data: gigs } = await supabase
    .from('gigs')
    .select('budget, status')
    .eq('brand_id', brandId);

  const totalSpent = gigs
    ?.filter(g => g.status === 'completed')
    .reduce((sum, g) => sum + (g.budget || 0), 0) || 0;

  return {
    activeGigs: gigs?.filter(g => g.status === 'open' || g.status === 'in_progress').length || 0,
    completedGigs: gigs?.filter(g => g.status === 'completed').length || 0,
    totalSpent
  };
}

export async function getCreatorStats(creatorId) {
  const { data: submissions } = await supabase
    .from('submissions')
    .select('status, gigs(budget)')
    .eq('creator_id', creatorId);

  const { data: profile } = await supabase
    .from('creator_profiles')
    .select('rating')
    .eq('user_id', creatorId)
    .single();

  const approved = submissions?.filter(s => s.status === 'approved') || [];
  const earnings = approved.reduce((sum, s) => sum + (s.gigs?.budget || 0), 0);

  return {
    totalEarnings: earnings,
    pendingReviews: submissions?.filter(s => s.status === 'pending').length || 0,
    completedJobs: approved.length,
    rating: profile?.rating || 0
  };
}
