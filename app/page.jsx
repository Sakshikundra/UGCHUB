'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Briefcase,
  Palette
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold gradient-text">UGCHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="gradient-purple hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 gradient-purple text-white border-0 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Trusted by 1000+ Creators & Brands
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Empowering Creators.
            <br />
            <span className="gradient-text">Amplifying Brands.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            The marketplace where brands discover authentic content creators and creators monetize their talent through secure, transparent gigs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=creator">
              <Button size="lg" className="gradient-purple hover:opacity-90 text-lg px-8 py-6">
                <Palette className="mr-2 h-5 w-5" />
                Join as Creator
              </Button>
            </Link>
            <Link href="/signup?role=brand">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 text-lg px-8 py-6">
                <Briefcase className="mr-2 h-5 w-5" />
                Post a Gig
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { icon: Users, label: 'Active Creators', value: '5,000+' },
            { icon: Briefcase, label: 'Gigs Posted', value: '10,000+' },
            { icon: DollarSign, label: 'Paid to Creators', value: '₹50L+' },
          ].map((stat, index) => (
            <Card key={index} className="glass border-white/10 hover:border-purple-400/50 transition-all duration-300 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-6 text-center">
                <stat.icon className="h-10 w-10 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose UGCHub?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A platform built for trust, transparency, and growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Escrow Protection',
              description: 'Funds held securely until work is approved. Both parties protected.',
              color: 'text-green-400',
            },
            {
              icon: Zap,
              title: 'Instant Payouts',
              description: 'Get paid immediately after approval. No waiting periods.',
              color: 'text-yellow-400',
            },
            {
              icon: TrendingUp,
              title: 'Build Your Portfolio',
              description: 'Showcase approved work and attract premium gigs.',
              color: 'text-blue-400',
            },
            {
              icon: Users,
              title: 'Quality Creators',
              description: 'Access verified creators with proven track records.',
              color: 'text-purple-400',
            },
            {
              icon: DollarSign,
              title: 'Transparent Pricing',
              description: 'Set your budget. No hidden fees. 15% platform commission.',
              color: 'text-pink-400',
            },
            {
              icon: Star,
              title: 'Review System',
              description: 'Rate and review to build trust in the community.',
              color: 'text-orange-400',
            },
          ].map((feature, index) => (
            <Card key={index} className="glass border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works - Dual Journey */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Brand Journey */}
          <Card className="glass border-purple-400/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-8 w-8 text-purple-400" />
                <CardTitle className="text-2xl text-white">For Brands</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Create a detailed gig with budget & requirements',
                'Pay via secure escrow (Razorpay)',
                'Receive submissions from talented creators',
                'Review & approve content',
                'Creator gets paid automatically',
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center text-purple-400 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Creator Journey */}
          <Card className="glass border-pink-400/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-8 w-8 text-pink-400" />
                <CardTitle className="text-2xl text-white">For Creators</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Browse marketplace & filter by budget',
                'Apply to gigs that match your niche',
                'Upload your content submission',
                'Get feedback or approval from brand',
                'Receive 85% payout instantly to wallet',
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-400/20 flex items-center justify-center text-pink-400 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="gradient-purple border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <CardContent className="p-12 md:p-16 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and brands already using UGCHub to create amazing content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup?role=creator">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup?role=brand">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Post Your First Gig
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">UGCHub</span>
              </div>
              <p className="text-gray-400">
                Empowering creators and amplifying brands through authentic content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">For Creators</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-purple-400">Browse Gigs</Link></li>
                <li><Link href="/signup?role=creator" className="hover:text-purple-400">Sign Up</Link></li>
                <li><Link href="#" className="hover:text-purple-400">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">For Brands</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/signup?role=brand" className="hover:text-purple-400">Post a Gig</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Pricing</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-purple-400">About Us</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Contact</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 UGCHub. Built with ❤️ for the Creator Economy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
