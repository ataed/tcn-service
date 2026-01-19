import { redirect } from "next/navigation";

export default function AdminRootRedirect() {
  // Automatically sends user to the dashboard
  redirect("/admin/dashboard");
}
