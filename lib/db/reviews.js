import { supabase } from '@/lib/supabase';

// ==========================================
// Review Queries
// ==========================================

/**
 * Create a new review and update the creator's average rating
 * @param {Object} reviewData - { gigId, reviewerId, revieweeId, rating, comment }
 */
export async function createReview({ gigId, reviewerId, revieweeId, rating, comment }) {
  try {
    // 1. Insert the review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        gig_id: gigId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        comment
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Recalculate Average Rating for the Creator
    // Fetch all reviews for this creator to calculate new average
    const { data: allReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', revieweeId);
      
    if (fetchError) throw fetchError;

    if (allReviews && allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / allReviews.length;
        
        // Update Creator Profile
        // Note: reviewee_id IS the user_id in creator_profiles
        const { error: updateError } = await supabase
            .from('creator_profiles')
            .update({ 
                rating: avgRating, 
                // We could also atomic increment completed_gigs_count here if not done elsewhere
            })
            .eq('user_id', revieweeId);

        if (updateError) {
            console.error('Failed to update creator profile rating:', updateError);
            // Non-blocking error, but good to log
        }
    }

    return review;

  } catch (error) {
    console.error('createReview Error:', error);
    throw error;
  }
}

export async function getReviewsForCreator(creatorId) {
    try {
        // Fetch reviews where reviewee_id is the creator
        // Also join with reviewer (brand) details
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                reviewer:users!reviewer_id (
                    name,
                    avatar_url,
                    brand_profiles (company_name)
                )
            `)
            .eq('reviewee_id', creatorId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return data.map(review => ({
            ...review,
            reviewerName: review.reviewer?.brand_profiles?.company_name || review.reviewer?.name,
            reviewerAvatar: review.reviewer?.avatar_url
        }));

    } catch (error) {
        console.error('getReviewsForCreator Error:', error);
        return [];
    }
}
