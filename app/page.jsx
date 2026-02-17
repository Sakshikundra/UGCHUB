'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
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
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" className="text-white hover:text-purple-400">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="gradient-purple hover:opacity-90">
                    Get Started
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-purple-400">
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </SignedIn>
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
            <SignUpButton fallbackRedirectUrl="/dashboard?role=creator">
              <Button size="lg" className="gradient-purple hover:opacity-90 text-lg px-8 py-6">
                <Palette className="mr-2 h-5 w-5" />
                Join as Creator
              </Button>
            </SignUpButton>
            <SignUpButton fallbackRedirectUrl="/dashboard?role=brand">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 text-lg px-8 py-6">
                <Briefcase className="mr-2 h-5 w-5" />
                Post a Gig
              </Button>
            </SignUpButton>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { icon: Users, label: 'Active Creators', value: '5,000+' },
            { icon: Briefcase, label: 'Gigs Posted', value: '10,000+' },
            { icon: DollarSign, label: 'Paid to Creators', value: '₹50L+' },
          ].map((stat, index) => (
            <Card key={index} className="glass border-white/20 hover:border-purple-400/50 transition-all duration-300 animate-float bg-black/30" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-6 text-center">
                <stat.icon className="h-10 w-10 mx-auto mb-3 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <div className="text-4xl font-extrabold text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{stat.value}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Interactive Visuals & Hero Extension */}
      <section className="container mx-auto px-4 pb-20 overflow-hidden">
        <div className="relative h-[400px] w-full max-w-5xl mx-auto border border-white/10 rounded-2xl glass p-8 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
           {/* Floating Nodes Visualization */}
           {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="absolute text-center animate-float opacity-80"
                style={{
                  top: `${Math.random() * 80}%`, 
                  left: `${Math.random() * 80}%`, 
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`
                }}
              >
                  <div className="w-16 h-16 rounded-full bg-black/50 border border-purple-500/30 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    {i % 3 === 0 ? <Play className="text-pink-400 fill-pink-400" /> : 
                     i % 3 === 1 ? <Users className="text-blue-400" /> : 
                                   <DollarSign className="text-green-400" />}
                  </div>
                  <div className="bg-black/80 px-3 py-1 rounded-full text-xs border border-white/10 text-white">
                    {['Viral Reel', 'Collab', 'Payout ₹5k', 'Brand Deal', 'UGC', 'Review'][i]}
                  </div>
              </div>
           ))}
           <div className="relative z-10 text-center">
             <h3 className="text-3xl font-bold text-white mb-2">The Creator Economy Network</h3>
             <p className="text-gray-400">Connect, Collaborate, Create.</p>
           </div>
        </div>
      </section>

      {/* Testimonials / Reviews Section */}
      <section className="container mx-auto px-4 py-20 bg-black/20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by Creators & Brands
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what the community is saying about UGCHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Jenkins",
              role: "Lifestyle Creator",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
              quote: "The escrow system gives me total peace of mind. I know I'll get paid for my work instantly upon approval!",
              rating: 5
            },
            {
              name: "TechNova Inc.",
              role: "Brand Partner",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
              quote: "We found 5 amazing creators for our launch campaign in under 24 hours. The quality of content was top-tier.",
              rating: 5
            },
            {
              name: "Alex Rivera",
              role: "Tech Reviewer",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
              quote: "Finally a platform that treats creators like professionals. The interface is sleek and the gigs are legit.",
              rating: 5
            }
          ].map((review, index) => (
            <Card key={index} className="glass border-white/10 p-6 hover:translate-y-[-5px] transition-transform duration-300">
               <div className="flex items-center gap-4 mb-4">
                 <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-purple-500/50">
                   <img src={review.image} alt={review.name} className="h-full w-full object-cover" />
                 </div>
                 <div>
                   <h4 className="text-white font-bold">{review.name}</h4>
                   <p className="text-sm text-purple-300">{review.role}</p>
                 </div>
               </div>
               <div className="flex gap-1 mb-4">
                 {[...Array(review.rating)].map((_, i) => (
                   <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                 ))}
               </div>
               <p className="text-gray-300 italic">"{review.quote}"</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 🔥 Featured Gigs - Makes the app look populated */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 px-4 py-1">
            <Zap className="h-3 w-3 mr-1" /> Live Now
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Gigs
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Browse trending opportunities from top brands
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Instagram Reels for Skincare Launch",
              brand: "GlowUp Beauty",
              brandImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400&h=250",
              budget: "₹15,000",
              type: "Video",
              deadline: "Mar 15, 2026",
              slots: 3,
              totalSlots: 5,
              tags: ["Beauty", "Skincare", "Reels"],
              brandLogo: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=60"
            },
            {
              title: "Product Unboxing for Tech Gadget",
              brand: "TechVerse",
              brandImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400&h=250",
              budget: "₹25,000",
              type: "Video",
              deadline: "Mar 20, 2026",
              slots: 2,
              totalSlots: 4,
              tags: ["Tech", "Unboxing", "YouTube"],
              brandLogo: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?auto=format&fit=crop&q=80&w=60"
            },
            {
              title: "Lifestyle Photos for Fashion Brand",
              brand: "UrbanThread",
              brandImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400&h=250",
              budget: "₹10,000",
              type: "Photo",
              deadline: "Mar 10, 2026",
              slots: 5,
              totalSlots: 8,
              tags: ["Fashion", "Lifestyle", "Instagram"],
              brandLogo: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=60"
            },
            {
              title: "Recipe Video for Health Food Brand",
              brand: "NutriFit",
              brandImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400&h=250",
              budget: "₹18,000",
              type: "Video",
              deadline: "Mar 25, 2026",
              slots: 4,
              totalSlots: 6,
              tags: ["Food", "Health", "Recipe"],
              brandLogo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=60"
            },
            {
              title: "Review & Testimonial for SaaS App",
              brand: "CloudSync Pro",
              brandImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=250",
              budget: "₹8,000",
              type: "Review",
              deadline: "Mar 12, 2026",
              slots: 6,
              totalSlots: 10,
              tags: ["SaaS", "Tech", "Review"],
              brandLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=60"
            },
            {
              title: "Travel Vlog for Tourism Campaign",
              brand: "WanderIndia",
              brandImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=400&h=250",
              budget: "₹35,000",
              type: "Video",
              deadline: "Apr 1, 2026",
              slots: 1,
              totalSlots: 2,
              tags: ["Travel", "Vlog", "Tourism"],
              brandLogo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=60"
            }
          ].map((gig, index) => (
            <Card key={index} className="glass border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden group cursor-pointer relative">
              <Link href="/marketplace" className="absolute inset-0 z-20">
                <span className="sr-only">View Gig</span>
              </Link>
              {/* Cover Image */}
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={gig.brandImage} 
                  alt={gig.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge className={`${gig.type === 'Video' ? 'bg-pink-500/90' : gig.type === 'Photo' ? 'bg-blue-500/90' : 'bg-green-500/90'} text-white border-0 text-xs`}>
                    {gig.type === 'Video' ? '🎬' : gig.type === 'Photo' ? '📸' : '⭐'} {gig.type}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white/50">
                    <img src={gig.brandLogo} alt={gig.brand} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">{gig.brand}</span>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                  {gig.title}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {gig.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div>
                    <div className="text-xl font-bold text-white">{gig.budget}</div>
                    <div className="text-[11px] text-gray-500">per creator</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <span>⏰</span> {gig.deadline}
                    </div>
                    <div className="text-xs text-green-400 mt-0.5">
                      {gig.slots}/{gig.totalSlots} slots open
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/marketplace">
            <Button size="lg" className="gradient-purple hover:opacity-90 px-8">
              View All Gigs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 🌟 Top Creators Showcase */}
      <section className="container mx-auto px-4 py-20 bg-black/20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Top Creators This Month
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover talented creators ready to bring your brand vision to life
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Priya S.", niche: "Beauty", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", gigs: 24, rating: 4.9 },
            { name: "Arjun M.", niche: "Tech", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", gigs: 18, rating: 4.8 },
            { name: "Nisha K.", niche: "Food", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200", gigs: 32, rating: 5.0 },
            { name: "Rahul D.", niche: "Travel", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", gigs: 15, rating: 4.7 },
            { name: "Ankita R.", niche: "Fashion", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", gigs: 28, rating: 4.9 },
            { name: "Vikram P.", niche: "Fitness", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", gigs: 21, rating: 4.8 },
          ].map((creator, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-purple-500/50 group-hover:border-purple-400 transition-all mb-3 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-white font-semibold text-sm">{creator.name}</h4>
              <p className="text-purple-300 text-xs">{creator.niche}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-yellow-500 text-xs font-medium">{creator.rating}</span>
              </div>
              <p className="text-gray-500 text-[10px] mt-0.5">{creator.gigs} gigs done</p>
            </div>
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
            <SignUpButton fallbackRedirectUrl="/dashboard?role=creator">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
              <SignUpButton fallbackRedirectUrl="/dashboard?role=brand">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Post Your First Gig
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
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
