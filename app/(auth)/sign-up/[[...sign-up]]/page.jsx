import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
            card: 'bg-slate-900 border-purple-500/20',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            socialButtonsBlockButton: 'border-purple-500/30 text-white hover:bg-purple-500/10',
            formFieldLabel: 'text-gray-300',
            formFieldInput: 'bg-black/50 border-gray-800 text-white',
            footerActionLink: 'text-purple-400 hover:text-purple-300',
          },
        }}
      />
    </div>
  )
}
