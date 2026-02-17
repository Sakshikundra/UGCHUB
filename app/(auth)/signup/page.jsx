'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
      <SignUp 
        routing="hash"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
            card: 'bg-slate-900/80 border border-purple-500/20 shadow-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: 'border-purple-500/30 text-white hover:bg-purple-500/10',
            formFieldLabel: 'text-gray-300',
            formFieldInput: 'bg-black/50 border-gray-800 text-white',
            footerActionLink: 'text-purple-400 hover:text-purple-300',
          },
        }}
        fallbackRedirectUrl={role ? `/dashboard?role=${role}` : "/dashboard"}
        unsafeMetadata={{ role: role || 'creator' }} // Default to creator if no role
      />
    </div>
  );
}
