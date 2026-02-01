import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCreatorSubmissions } from "@/lib/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function PortfolioPage() {
  const session = await auth();
  if (session?.user?.role !== 'creator') redirect('/dashboard/brand');

  const submissions = await getCreatorSubmissions(session.user.id);
  const portfolioItems = submissions.filter(s => s.status === 'approved');

  return (
    <div className="space-y-8">
       <div>
        <Link href="/dashboard/creator" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">Your Portfolio</h1>
        <p className="text-gray-400">Showcase of your approved work on UGCHub</p>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="border border-dashed border-gray-800 rounded-lg p-12 text-center bg-black/20">
            <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No portfolio items yet</h3>
            <p className="text-gray-400 mb-6">
                Approved submissions will automatically appear here to build your portfolio.
            </p>
            <Link href="/marketplace">
              <Button className="gradient-purple">
                Start Applying
              </Button>
            </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item) => (
                <Card key={item.id} className="glass border-purple-500/10 overflow-hidden hover:border-purple-500/30 transition-all">
                    <div className="aspect-video bg-gray-900 relative group">
                        {/* Placeholder for real thumbnail if we had one */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                            <ImageIcon className="h-12 w-12" />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={item.file_url} target="_blank" rel="noreferrer">
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Content
                                </Button>
                            </a>
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-bold text-white truncate">{item.gigs?.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-0">
                                {item.gigs?.content_type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                                {new Date(item.submitted_at).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
