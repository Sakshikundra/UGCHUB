import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getGigById, getGigSubmissions } from "@/lib/db/queries";
import { SubmitWorkDialog } from "@/components/submit-work-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"; // Ensure this exists or use hr
import { ArrowLeft, Clock, DollarSign, MapPin, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";

export default async function GigDetailsPage({ params }) {
  const session = await auth();
  const gig = await getGigById(params.id);
  
  if (!gig) return notFound();

  // Check if user has already submitted
  const submissions = await getGigSubmissions(params.id);
  const userSubmission = session ? submissions.find(s => s.creator_id === session.user?.id) : null;
  const isCreator = session?.user?.role === 'creator';
  const isOwner = session?.user?.id === gig.brand_id;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header / Nav */}
       <div className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
             <Link href="/marketplace" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
             </Link>
          </div>
       </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
             {/* Title Section */}
             <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                   <Badge variant="outline" className="border-purple-500/30 text-purple-400 capitalize px-3 py-1 text-sm">
                      {gig.content_type}
                   </Badge>
                   <span className="text-gray-400 flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      Posted {formatDate(gig.created_at)}
                   </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                   {gig.title}
                </h1>
             </div>

             {/* Gig Description */}
             <div className="space-y-6">
                <section>
                   <h3 className="text-xl font-bold text-white mb-4">About the Gig</h3>
                   <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                      {gig.description}
                   </div>
                </section>

                {gig.reference_files && gig.reference_files.length > 0 && (
                   <section>
                      <h3 className="text-xl font-bold text-white mb-4">Reference Material</h3>
                      {/* TODO: List reference files here */}
                      <p className="text-gray-400 italic">No previews available.</p>
                   </section>
                )}
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             {/* Action Card */}
             <Card className="glass border-purple-500/10 p-6 sticky top-28">
                <div className="flex items-baseline justify-between mb-8">
                   <span className="text-gray-400">Budget</span>
                   <span className="text-3xl font-bold text-white">{formatCurrency(gig.budget)}</span>
                </div>

                <div className="space-y-6 mb-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                         <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Clock className="h-5 w-5 text-purple-400" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Deadline</span>
                            <span className="font-medium">{formatDate(gig.deadline)}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                         <div className="p-2 bg-purple-500/10 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-purple-400" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Payment</span>
                            <span className="font-medium">Escrow Secured</span>
                         </div>
                      </div>
                   </div>

                   {/* Applicants Section */}
                   <div className="pt-4 border-t border-gray-800">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">
                         {submissions.length} Applicants
                      </h4>
                      {submissions.length > 0 ? (
                         <div className="flex -space-x-2 overflow-hidden">
                            {submissions.slice(0, 5).map((sub) => (
                               <Avatar key={sub.id} className="inline-block h-8 w-8 ring-2 ring-black">
                                  <AvatarFallback className="bg-gray-800 text-xs text-gray-400">
                                     {getInitials(sub.users?.name || 'User')}
                                  </AvatarFallback>
                               </Avatar>
                            ))}
                            {submissions.length > 5 && (
                               <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-black bg-gray-800 text-xs text-white">
                                  +{submissions.length - 5}
                               </div>
                            )}
                         </div>
                      ) : (
                         <p className="text-xs text-gray-500 italic">Be the first to apply!</p>
                      )}
                   </div>
                </div>

                {isCreator ? (
                   userSubmission ? (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                         <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                         <p className="text-green-400 font-medium">Application Submitted</p>
                         <p className="text-xs text-green-300/70 mt-1">Status: {userSubmission.status}</p>
                      </div>
                   ) : (
                      <SubmitWorkDialog gigId={gig.id} gigTitle={gig.title} />
                   )
                ) : isOwner ? (
                   <Link href={`/dashboard/brand/gigs/${gig.id}`}>
                      <Button className="w-full gradient-purple">Manage Gig</Button>
                   </Link>
                ) : (
                   <div className="p-4 bg-gray-800/50 rounded-lg text-center text-gray-400 text-sm">
                      Log in as a creator to apply
                   </div>
                )}
             </Card>

             {/* Brand Info */}
             <Card className="glass border-gray-800 p-6">
                <div className="flex items-center gap-4 mb-4">
                   <Avatar className="h-12 w-12 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-gray-800 text-gray-400">
                         {getInitials(gig.brand_profiles?.company_name || 'Brand')}
                      </AvatarFallback>
                   </Avatar>
                   <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                         {gig.brand_profiles?.company_name}
                         {gig.brand_profiles?.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                         )}
                      </h4>
                      <p className="text-sm text-gray-500">{gig.brand_profiles?.industry}</p>
                   </div>
                </div>
                {gig.brand_profiles?.website && (
                   <a 
                      href={gig.brand_profiles.website} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-purple-400 hover:text-purple-300"
                   >
                      Visit Website
                   </a>
                )}
             </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
