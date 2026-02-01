import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCreatorStats, getCreatorSubmissions } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Download, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EarningsPage() {
  const session = await auth();
  if (session?.user?.role !== 'creator') redirect('/dashboard/brand');

  const stats = await getCreatorStats(session.user.id);
  // In a real app, we'd fetch actual transaction history here
  const submissions = await getCreatorSubmissions(session.user.id);
  const paidJobs = submissions.filter(s => s.status === 'approved');

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/creator" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">Earnings & Payouts</h1>
        <p className="text-gray-400">Track your income and withdrawal history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass border-green-500/20 md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="h-5 w-5 text-green-400" />
                    Total Lifetime Earnings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-white mb-2">
                    {formatCurrency(stats.totalEarnings)}
                </div>
                <p className="text-sm text-gray-400">
                    Includes all approved and paid gigs.
                </p>
            </CardContent>
        </Card>

        <Card className="glass border-purple-500/10">
            <CardHeader>
                <CardTitle className="text-white">Available for Payout</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white mb-4">
                    {formatCurrency(stats.totalEarnings)} 
                    {/* Simplified: Assuming all earnings are available. Real app would track 'balance' separate from 'total' */}
                </div>
                <Button className="w-full gradient-purple" disabled={stats.totalEarnings <= 0}>
                    Request Withdrawal
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Payouts processed via Razorpay/Bank Transfer
                </p>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Transaction History</h2>
        <Card className="glass border-gray-800">
            <CardContent className="p-0">
                {paidJobs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No transactions found yet. Complete gigs to start earning!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {paidJobs.map((job) => (
                            <div key={job.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div>
                                    <h4 className="font-medium text-white">{job.gigs?.title}</h4>
                                    <p className="text-sm text-gray-400">Payout for approved submission</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-green-400 font-bold">
                                        +{formatCurrency(job.gigs?.budget)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatDate(job.reviewed_at || job.submitted_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
