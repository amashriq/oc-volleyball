import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Pinged by the Vercel Cron Job defined in vercel.json to keep the Supabase
// project active (Supabase pauses free-tier projects after 7 days with no
// API requests).
export async function GET() {
  const supabase = await createClient();

  const { error } = await supabase.from("events").select("id").limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
