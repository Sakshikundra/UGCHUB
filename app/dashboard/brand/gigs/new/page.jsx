'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { gigSchema, ContentType } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewGigPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      slotsAvailable: 1,
      budget: 500,
      contentType: ContentType.REEL,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...data,
        requirements: {
          guidelines: data.guidelines
        }
      };

      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to create gig');
      }

      toast({
        title: "Success",
        description: "Gig posted successfully!",
      });

      router.push('/dashboard/brand');
      router.refresh();
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error creating gig",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/brand" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Create New Gig</h1>
        <p className="text-gray-400">Post a new opportunity for creators</p>
      </div>

      <Card className="glass border-purple-500/20 max-w-3xl">
        <CardHeader>
          <CardTitle>Gig Details</CardTitle>
          <CardDescription>Fill in the details for your content requirement</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Gig Title</Label>
              <Input
                id="title"
                placeholder="e.g. Energetic Reel for Skincare Launch"
                className="bg-black/50 border-gray-800 text-white"
                {...register('title')}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contentType" className="text-white">Content Type</Label>
                <Controller
                  name="contentType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ContentType).map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.contentType && <p className="text-red-500 text-sm">{errors.contentType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-white">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="500"
                  className="bg-black/50 border-gray-800 text-white"
                  {...register('budget', { valueAsNumber: true })}
                />
                {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                placeholder="Overview of the project..."
                className="bg-black/50 border-gray-800 text-white min-h-[100px]"
                {...register('description')}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guidelines" className="text-white">Guidelines / specific Instructions</Label>
              <Textarea
                id="guidelines"
                placeholder="Step-by-step instructions for the creator (e.g. 1. Start with a hook, 2. Show product close-up...)"
                className="bg-black/50 border-gray-800 text-white min-h-[150px]"
                {...register('guidelines')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-white">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  className="bg-black/50 border-gray-800 text-white"
                  {...register('deadline')}
                />
                {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotsAvailable" className="text-white">Slots Available</Label>
                <Input
                  id="slotsAvailable"
                  type="number"
                  min="1"
                  max="50"
                  className="bg-black/50 border-gray-800 text-white"
                  {...register('slotsAvailable', { valueAsNumber: true })}
                />
                {errors.slotsAvailable && <p className="text-red-500 text-sm">{errors.slotsAvailable.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="gradient-purple" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Gig'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
