import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { userId } = await auth(); // <-- AWAIT ADDED
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const sb = supabaseServer();
  const fileName = `${userId}/${Date.now()}-${file.name}`;

  // Upload to storage
  const { error: uploadErr } = await sb.storage.from("pitch-decks").upload(fileName, file);
  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  // Insert deck record
  const { data, error } = await sb
    .from("decks")
    .insert({
      user_id: userId,
      file_name: file.name,
      file_path: fileName,
      status: "uploaded",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ id: data.id, file_path: fileName });
}