'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getInitials, formatDate } from '@/lib/utils';
import { ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SubmissionReviewCard({ submission }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [action, setAction] = useState(null); // 'approve' | 'reject'
  const router = useRouter();

  const handleReview = async () => {
    setIsReviewing(true);
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback }),
      });

      if (!response.ok) throw new Error('Failed to update submission');
      
      router.refresh();
      // Close dialog handled by Radix UI state if controlled, or just refresh page content
    } catch (error) {
      console.error(error);
    } finally {
      setIsReviewing(false);
      setAction(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 hover:bg-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30';
    }
  };

  return (
    <Card className="glass border-purple-500/10">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={submission.users?.avatar_url} />
          <AvatarFallback>{getInitials(submission.users?.name || 'User')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-white font-semibold">{submission.users?.name}</h4>
            <Badge className={getStatusColor(submission.status)}>
              {submission.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">
            Submitted {formatDate(submission.submitted_at)}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preview Area - Simple Link for now since we don't have real files */}
        <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center border border-gray-800">
          <a
            href={submission.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Submission Content
          </a>
        </div>
        
        {submission.notes && (
          <div className="text-sm text-gray-400 bg-white/5 p-3 rounded-md">
            <span className="font-semibold text-gray-300 block mb-1">Creator Notes:</span>
            "{submission.notes}"
          </div>
        )}
      </CardContent>

      <CardFooter>
        {submission.status === 'pending' ? (
          <div className="flex gap-2 w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => setAction('reject')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Submission</DialogTitle>
                  <DialogDescription>
                    Provide feedback to {submission.users?.name} on why this was rejected.
                  </DialogDescription>
                </DialogHeader>
                <Textarea 
                  placeholder="Feedback..." 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleReview} disabled={isReviewing}>
                    {isReviewing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Rejection'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setAction('approve')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Submission</DialogTitle>
                  <DialogDescription>
                    Confirm approval. This will release the payment to {submission.users?.name}.
                  </DialogDescription>
                </DialogHeader>
                <Textarea 
                  placeholder="Optional feedback..." 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleReview} disabled={isReviewing}>
                    {isReviewing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Approval'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="w-full text-center text-sm text-gray-500">
             {submission.status === 'approved' ? 'Payment released' : 'Feedback sent'}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
