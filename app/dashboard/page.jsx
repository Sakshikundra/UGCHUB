import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardRoot() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  // Redirect based on role
  if (session.user.role === "brand") {
    redirect("/dashboard/brand");
  } else {
    redirect("/dashboard/creator");
  }
}
