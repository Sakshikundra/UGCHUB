import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGigs } from "@/lib/db/queries";
import { GigFilters } from "@/components/gig-filters";
import { MarketplaceGigCard } from "@/components/marketplace-gig-card";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default async function MarketplacePage({ searchParams }) {
  const session = await auth();
  
  // Optional: Redirect brands back to their dashboard if they try to browse as a creator?
  // For now, allowing open access but maybe we should specificy.
  if(!session) redirect('/login');

  const filters = {
    type: searchParams.type,
    minBudget: searchParams.minBudget ? Number(searchParams.minBudget) : undefined,
  };

  const gigs = await getGigs(filters);

  return (
    <div className="min-h-screen bg-slate-950">
        {/* Simple Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Link href="/dashboard" className="mr-4 text-gray-400 hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold gradient-text">Marketplace</span>
             </div>
             <div className="flex items-center gap-4">
                {/* Could add user avatar/profile menu here */}
             </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <GigFilters />
          </div>

          {/* Gig Grid */}
          <div className="lg:col-span-3">
             <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Available Gigs</h1>
                <p className="text-gray-400">Found {gigs.length} opportunities for you</p>
             </div>

            {gigs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-800 rounded-lg bg-black/20 h-64">
                <p className="text-xl text-gray-400">No gigs found matching your filters.</p>
                <Link href="/marketplace" className="mt-4 text-purple-400 hover:text-purple-300">
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {gigs.map((gig) => (
                  <MarketplaceGigCard key={gig.id} gig={gig} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
