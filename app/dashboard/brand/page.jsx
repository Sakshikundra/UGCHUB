import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBrandStats } from "@/lib/db/queries";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function BrandDashboard() {
  const session = await auth();
  if (session?.user?.role !== 'brand') redirect('/dashboard/creator');

  const stats = await getBrandStats(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <p className="text-gray-400">Welcome back, {session.user.name}</p>
        </div>
        <Link href="/dashboard/brand/gigs/new">
          <Button className="gradient-purple">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Gig
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          icon="dollar"
          description="Lifetime platform spend"
        />
        <StatsCard
          title="Active Gigs"
          value={stats.activeGigs}
          icon="briefcase"
          description="Currently live or in progress"
        />
        <StatsCard
          title="Completed Gigs"
          value={stats.completedGigs}
          icon="activity"
          description="Successfully finished jobs"
        />
      </div>

      {/* TODO: Add Recent Activity / Gigs Table here */}
      <div className="border border-dashed border-gray-800 rounded-lg p-12 text-center">
        <p className="text-gray-500">Recent activity will appear here...</p>
      </div>
    </div>
  );
}
