import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBrandStats, getBrandGigs } from "@/lib/db/queries";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, Zap, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function BrandDashboard() {
  const session = await auth();
  if (session?.user?.role !== 'brand') redirect('/dashboard/creator');

  const [stats, gigs] = await Promise.all([
    getBrandStats(session.user.id),
    getBrandGigs(session.user.id)
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Hello, <span className="gradient-text">{session.user.name}</span>
            <span className="ml-2 inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-gray-400">Here's what's happening with your brand today.</p>
        </div>
        <Link href="/dashboard/brand/gigs/new">
          <Button className="gradient-purple hover:opacity-90 transition-opacity rounded-full px-6 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Gig
          </Button>
        </Link>
      </div>

      {/* Daily Task Widget */}
      <Card className="glass border-purple-500/30 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="h-32 w-32 text-purple-500" />
        </div>
        <CardContent className="p-8 flex items-center justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-medium">
              <Zap className="h-4 w-4" />
              <span>Daily Creator Challenge</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Review 3 Creator Portfolios</h3>
            <p className="text-gray-400 max-w-xl">
              Engage with top talent! Identify 3 potentially viral creators for your next campaign to boost your brand visibility.
            </p>
          </div>
          <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-white rounded-full">
            Start Task <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          icon="dollar"
          description="Lifetime platform spend"
          className="hover-scale"
        />
        <StatsCard
          title="Active Gigs"
          value={stats.activeGigs}
          icon="briefcase"
          description="Currently live or in progress"
          className="hover-scale"
        />
        <StatsCard
          title="Completed Gigs"
          value={stats.completedGigs}
          icon="activity"
          description="Successfully finished jobs"
          className="hover-scale"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Recent Gigs
          </h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">View All</Button>
        </div>

        {gigs.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-lg p-12 text-center glass">
            <p className="text-gray-500">No gigs yet. Post your first gig to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <Card key={gig.id} className="glass hover-scale hover-glow cursor-pointer border-gray-800 hover:border-purple-500/50 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20 capitalize">
                    {gig.content_type || 'Gig'}
                  </Badge>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(gig.deadline).toLocaleDateString()}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">{formatCurrency(gig.budget)}</div>
                  <h3 className="font-semibold text-gray-200 line-clamp-1 mb-2">{gig.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {gig.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-3">
                    <span>{gig.slots_available} slots open</span>
                    <span className="capitalize text-green-400">{gig.status.replace('_', ' ')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
