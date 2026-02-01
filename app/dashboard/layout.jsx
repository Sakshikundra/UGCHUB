import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar userRole={session.user.role} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
