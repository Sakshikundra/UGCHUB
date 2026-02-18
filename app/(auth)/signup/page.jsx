import { Suspense } from "react";
import PageContent from "./PageContent";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
