import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  const { origin } = new URL(request.url);
  return NextResponse.redirect(origin, { status: 302 });
}
