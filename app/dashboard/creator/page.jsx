import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCreatorStats, getCreatorSubmissions } from "@/lib/db/queries";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CreatorDashboard() {
  const session = await auth();
  if (session?.user?.role !== 'creator') redirect('/dashboard/brand');

  const stats = await getCreatorStats(session.user.id);
  const submissions = await getCreatorSubmissions(session.user.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <p className="text-gray-400">Welcome back, {session.user.name}</p>
        </div>
        <Link href="/marketplace">
          <Button className="gradient-purple">
            <Sparkles className="mr-2 h-4 w-4" />
            Find Work
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Earnings"
          value={formatCurrency(stats.totalEarnings)}
          icon="dollar"
          description="Lifetime earnings"
        />
        <StatsCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon="activity"
          description="Submissions awaiting approval"
        />
        <StatsCard
          title="Completed Jobs"
          value={stats.completedJobs}
          icon="briefcase"
          description="Successfully completed gigs"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-xl font-bold text-white">Recent Applications</h2>
        
        {submissions.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-lg p-12 text-center bg-black/20">
            <p className="text-gray-400 mb-4">You haven't applied to any gigs yet.</p>
            <Link href="/marketplace">
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
             {submissions.map((submission) => (
                <Card key={submission.id} className="glass border-purple-500/10 hover:bg-white/5 transition-colors">
                  <CardContent className="flex items-center justify-between p-6">
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="font-semibold text-white text-lg">{submission.gigs?.title}</h3>
                           <Badge variant="outline" className={`capitalize ${getStatusColor(submission.status)}`}>
                              {submission.status}
                           </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                           <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              Submitted on {formatDate(submission.submitted_at)}
                           </span>
                           <span className="flex items-center gap-1">
                              {formatCurrency(submission.gigs?.budget)}
                           </span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4">
                        {submission.status === 'approved' && (
                           <div className="flex items-center text-green-400 text-sm font-medium">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Earned
                           </div>
                        )}
                        <Link href={`/marketplace/${submission.gig_id}`}>
                           <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <ArrowRight className="h-5 w-5" />
                           </Button>
                        </Link>
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
