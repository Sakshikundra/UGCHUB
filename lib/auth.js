import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server';

// Compatibility wrapper: returns a session-like object matching
// the old NextAuth pattern so existing API routes work unchanged.
// Usage: const session = await auth();
//        session.user.id, session.user.email, session.user.role, etc.
export async function auth() {
  const { userId } = await clerkAuth();
  
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  return {
    user: {
      id: userId,
      email: user.emailAddresses?.[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      image: user.imageUrl || null,
      role: user.publicMetadata?.role || user.unsafeMetadata?.role || 'creator',
    },
  };
}
