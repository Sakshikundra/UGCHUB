'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { brandProfileSchema, creatorProfileSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState(session?.user?.role || 'creator');
  const role = session?.user?.role || selectedRole;
  const isBrand = role === 'brand';
  
  const schema = isBrand ? brandProfileSchema : creatorProfileSchema;
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      // Force a hard refresh to update session with new role
      window.location.href = '/dashboard'; 
    } catch (error) {
      console.error(error);
      // Handle error notification here
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="glass border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Complete Your Profile</CardTitle>
            <CardDescription className="text-gray-400">
              {isBrand 
                ? "Tell us about your brand to start posting gigs." 
                : "Showcase your skills to attract brands."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection for OAuth Users who haven't picked a role yet */}
            {!session?.user?.role && (
                <div className="mb-8 p-4 bg-black/40 rounded-lg border border-gray-800">
                    <Label className="text-white mb-3 block">I am a:</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            type="button"
                            variant={isBrand ? "default" : "outline"}
                            className={isBrand ? "bg-purple-600 hover:bg-purple-700" : "border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"}
                            onClick={() => setSelectedRole('brand')}
                        >
                            Brand
                        </Button>
                        <Button 
                            type="button"
                            variant={!isBrand ? "default" : "outline"}
                            className={!isBrand ? "bg-purple-600 hover:bg-purple-700" : "border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"}
                            onClick={() => setSelectedRole('creator')}
                        >
                            Creator
                        </Button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {isBrand ? (
                // Brand Profile Form
                <>
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
                    <Label htmlFor="website" className="text-white">Website (Optional)</Label>
                    <Input
                      id="website"
                      placeholder="https://..."
                      className="bg-black/50 border-gray-800 text-white"
                      {...register('website')}
                    />
                    {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
                  </div>
                </>
              ) : (
                // Creator Profile Form
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell brands about yourself and your style..."
                      className="bg-black/50 border-gray-800 text-white min-h-[100px]"
                      {...register('bio')}
                    />
                    {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl" className="text-white">Portfolio URL (Optional)</Label>
                    <Input
                      id="portfolioUrl"
                      placeholder="https://..."
                      className="bg-black/50 border-gray-800 text-white"
                      {...register('portfolioUrl')}
                    />
                    {errors.portfolioUrl && <p className="text-red-500 text-sm">{errors.portfolioUrl.message}</p>}
                  </div>

                  {/* Note: Niches selection would ideally be a multi-select component */}
                </>
              )}

              <Button type="submit" className="w-full gradient-purple" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
