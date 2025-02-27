// app/profile/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ProfileContent from "./ProfileContent";

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Ensure the session exists and the email is present
  if (!session || !session.user.email) {
    redirect("/login");
  }

  // Use the non-null assertion operator (!) to assure TypeScript that email is defined
  return <ProfileContent email={session.user.email!} />;
}
