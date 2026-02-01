'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Users, Calendar, MapPin, Edit, Eye } from 'lucide-react';

export function BrandGigCard({ gig }) {
  const submissionCount = gig.submissions ? gig.submissions[0]?.count || 0 : 0;
  
  return (
    <Card className="glass border-purple-500/10 hover:border-purple-500/30 transition-all">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl text-white line-clamp-1">{gig.title}</CardTitle>
          <Badge variant={gig.status === 'open' ? 'default' : 'secondary'} className="capitalize">
            {gig.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Budget</span>
          <span className="font-semibold text-white">{formatCurrency(gig.budget)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Deadline</span>
          <span className="text-gray-200">{formatDate(gig.deadline)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Submissions</span>
          <div className="flex items-center gap-1 text-white">
            <Users className="h-3 w-3 text-purple-400" />
            <span>{submissionCount} / {gig.slots_available}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/dashboard/brand/gigs/${gig.id}`} className="w-full">
          <Button className="w-full gradient-purple h-9">
            <Eye className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </Link>
        {/* We can add an Edit button here later if needed, but Manage page can handle edits */}
      </CardFooter>
    </Card>
  );
}
