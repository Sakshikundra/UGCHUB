import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getGigById, getGigSubmissions } from "@/lib/db/queries";
import { SubmissionReviewCard } from "@/components/submission-review-card";
import { EscrowPaymentButton } from "@/components/escrow-payment-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, DollarSign, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function GigManagePage({ params }) {
  const session = await auth();
  if (session?.user?.role !== 'brand') redirect('/dashboard');

  const gig = await getGigById(params.id);
  
  if (!gig) return notFound();
  
  // Security check: ensure brand owns this gig
  if (gig.brand_id !== session.user.id) redirect('/dashboard/brand');

  const submissions = await getGigSubmissions(params.id);
  const totalSubmissions = submissions.length;
  const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;

  // Determine if gig needs funding (assuming 'open' means funded, 'pending'/'draft' means not)
  // For simplicity, let's treat 'open' as funded. If using 'pending_payment' status, we'd check that.
  // We'll simulate checking gig status for funding.  
  const isFunded = gig.status === 'open' || gig.status === 'in_progress' || gig.status === 'completed';

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/brand/gigs" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Gigs
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{gig.title}</h1>
            <div className="flex gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Deadline: {formatDate(gig.deadline)}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Budget: {formatCurrency(gig.budget)}
              </span>
            </div>
          </div>
          <Badge className="text-base px-4 py-1 capitalize" variant={gig.status === 'open' ? 'default' : 'secondary'}>
            {gig.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

       {/* Payment Alert / Action */}
       {!isFunded && (
          <Card className="border-yellow-500/50 bg-yellow-500/10 mb-8">
             <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-500">
                      <AlertTriangle className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-white">Gig Funding Required</h3>
                      <p className="text-gray-300">Deposit the budget into escrow to activate this gig and receive submissions.</p>
                   </div>
                </div>
                <div className="w-64">
                   <EscrowPaymentButton gigId={gig.id} amount={gig.budget} gigTitle={gig.title} />
                </div>
             </CardContent>
          </Card>
       )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Submissions */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            Submissions 
            <Badge variant="secondary" className="rounded-full">{totalSubmissions}</Badge>
          </h2>
          
          {submissions.length === 0 ? (
            <Card className="glass border-dashed border-gray-700">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Users className="h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white">No submissions yet</h3>
                <p className="text-gray-400">Wait for creators to apply to your gig.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {submissions.map((submission) => (
                <SubmissionReviewCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Stats & Details */}
        <div className="space-y-6">
          <Card className="glass border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-lg">Gig Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Slots Filled</span>
                <span className="text-white font-medium">{approvedSubmissions} / {gig.slots_available}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min((approvedSubmissions / gig.slots_available) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

           <Card className="glass border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{gig.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
