'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, Briefcase, Palette } from 'lucide-react';
import { signupSchema, UserRole } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'brand' ? 'brand' : 'creator';
  const [role, setRole] = useState(defaultRole);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md glass border-purple-500/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-400">
            Join UGCHub to connect with brands and creators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue={defaultRole} onValueChange={(v) => setRole(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/50">
              <TabsTrigger value="creator" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Palette className="mr-2 h-4 w-4" />
                Creator
              </TabsTrigger>
              <TabsTrigger value="brand" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Briefcase className="mr-2 h-4 w-4" />
                Brand
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  placeholder={role === 'brand' ? "Company Name" : "Your Name"}
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-purple hover:opacity-90" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center text-gray-400 w-full">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
