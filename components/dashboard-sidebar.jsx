'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Settings, 
  LogOut,
  Sparkles 
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const brandLinks = [
  { href: '/dashboard/brand', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/brand/gigs/new', label: 'Post a Gig', icon: PlusCircle },
  { href: '/dashboard/brand/gigs', label: 'My Gigs', icon: FileText },
  { href: '/dashboard/brand/settings', label: 'Settings', icon: Settings },
];

const creatorLinks = [
  { href: '/dashboard/creator', label: 'Overview', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Browse Gigs', icon: Sparkles },
  { href: '/dashboard/creator/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/dashboard/creator/portfolio', label: 'Portfolio', icon: FileText },
];

import { DollarSign } from 'lucide-react';

export function DashboardSidebar({ userRole }) {
  const pathname = usePathname();
  const links = userRole === 'brand' ? brandLinks : creatorLinks;

  return (
    <div className="flex h-full flex-col border-r border-gray-800 bg-black/40 w-64">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <span>UGCHub</span>
        </div>
      </div>
      <div className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/5",
                  isActive && "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
