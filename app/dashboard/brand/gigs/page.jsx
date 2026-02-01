import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBrandGigs } from "@/lib/db/queries";
import { BrandGigCard } from "@/components/brand-gig-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function BrandGigsPage() {
  const session = await auth();
  if (session?.user?.role !== 'brand') redirect('/dashboard');

  const gigs = await getBrandGigs(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Gigs</h1>
          <p className="text-gray-400">Manage your postings and review submissions</p>
        </div>
        <Link href="/dashboard/brand/gigs/new">
          <Button className="gradient-purple">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Gig
          </Button>
        </Link>
      </div>

      {gigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-800 rounded-lg bg-black/20">
          <h3 className="text-xl font-semibold text-white mb-2">No gigs posted yet</h3>
          <p className="text-gray-400 mb-6">Create your first gig to start receiving submissions</p>
          <Link href="/dashboard/brand/gigs/new">
            <Button className="gradient-purple">
              Create Gig
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <BrandGigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
}
