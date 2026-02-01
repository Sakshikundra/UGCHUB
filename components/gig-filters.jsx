'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentType } from '@/lib/validations';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function GigFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    minBudget: searchParams.get('minBudget') || '',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.type && newFilters.type !== 'all') params.set('type', newFilters.type);
    if (newFilters.minBudget) params.set('minBudget', newFilters.minBudget);
    
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <Card className="glass border-purple-500/10 h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg text-white">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-400">Content Type</Label>
          <Select 
            value={filters.type} 
            onValueChange={(val) => handleFilterChange('type', val)}
          >
            <SelectTrigger className="bg-black/50 border-gray-800 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(ContentType).map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400">Min Budget (₹)</Label>
          <Input 
            type="number" 
            placeholder="e.g. 1000"
            className="bg-black/50 border-gray-800 text-white"
            value={filters.minBudget}
            onChange={(e) => handleFilterChange('minBudget', e.target.value)}
          />
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setFilters({ type: '', minBudget: '' });
            router.push('/marketplace');
          }}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
