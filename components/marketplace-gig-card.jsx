import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { Clock, DollarSign, MapPin } from 'lucide-react';

export function MarketplaceGigCard({ gig }) {
  return (
    <Card className="glass border-purple-500/10 hover:border-purple-500/30 transition-all group">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-purple-500/20">
              <AvatarFallback className="bg-purple-900/50 text-purple-200">
                {getInitials(gig.brand_profiles?.company_name || 'Brand')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium text-gray-300">
                {gig.brand_profiles?.company_name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {gig.brand_profiles?.verified && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-blue-500/10 text-blue-400 border-0">
                    Verified
                  </Badge>
                )}
                <span>{gig.brand_profiles?.industry}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 capitalize">
            {gig.content_type}
          </Badge>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {gig.title}
          </h3>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {gig.description}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5 bg-white/5 py-1 px-2.5 rounded-full">
            <DollarSign className="h-3.5 w-3.5 text-green-400" />
            <span className="text-white font-medium">{formatCurrency(gig.budget)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Due {formatDate(gig.deadline)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/marketplace/${gig.id}`} className="w-full">
          <Button className="w-full gradient-purple opacity-90 hover:opacity-100">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
