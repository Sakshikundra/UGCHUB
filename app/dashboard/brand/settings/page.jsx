'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { brandProfileSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";

export default function BrandSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(brandProfileSchema),
  });

  // Fetch current profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile'); 
        if (response.ok) {
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
                reset({
                    companyName: data.company_name,
                    industry: data.industry,
                    website: data.website || ''
                });
            }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      toast({
        title: "Settings Saved",
        description: "Your brand profile has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your brand profile and account preferences</p>
      </div>

      <Card className="glass border-purple-500/20 max-w-2xl">
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
          <CardDescription>This information will be displayed on your gigs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white">Company Name</Label>
              <Input
                id="companyName"
                className="bg-black/50 border-gray-800 text-white"
                {...register('companyName')}
              />
              {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-white">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g. Fashion, Tech, Beauty"
                className="bg-black/50 border-gray-800 text-white"
                {...register('industry')}
              />
              {errors.industry && <p className="text-red-500 text-sm">{errors.industry.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-white">Website</Label>
              <Input
                id="website"
                placeholder="https://..."
                className="bg-black/50 border-gray-800 text-white"
                {...register('website')}
              />
              {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
            </div>

            <Button type="submit" className="gradient-purple" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
