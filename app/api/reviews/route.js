import { auth } from "@/lib/auth";
import { createReview } from "@/lib/db/reviews";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { gigId, creatorId, rating, comment } = body;

    // Basic Validation
    if (!gigId || !creatorId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Call DB helper
    const review = await createReview({
        gigId,
        reviewerId: session.user.id, // Brand submitting the review
        revieweeId: creatorId,       // Creator receiving the review
        rating,
        comment
    });

    return NextResponse.json({ success: true, review });

  } catch (error) {
    console.error("Review Submission Error:", error);
    
    if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: "You have already reviewed this gig." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
