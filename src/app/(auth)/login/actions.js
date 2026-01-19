"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  // 1. Get data from the form
  const email = formData.get("email");
  const password = formData.get("password");

  // 2. Sign in using Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // 3. Revalidate and Redirect
  revalidatePath("/", "layout");
  redirect("/admin/listings"); // Send them to the inventory after login
}
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
