// Authentication is handled by Clerk.
// This file is kept as a stub to prevent 404s on legacy routes.
// Clerk manages auth via middleware.ts and ClerkProvider in layout.jsx.

export function GET() {
  return new Response(JSON.stringify({ message: "Auth is handled by Clerk" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function POST() {
  return new Response(JSON.stringify({ message: "Auth is handled by Clerk" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
