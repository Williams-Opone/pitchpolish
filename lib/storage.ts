import { supabaseServer } from "./supabase-server";

export async function getSignedPdfUrl(filePath: string, expiresIn = 300) {
  const sb = supabaseServer();
  const { data, error } = await sb.storage
    .from("pitch-decks")
    .createSignedUrl(filePath, expiresIn);
  if (error) throw error;
  return data?.signedUrl;
}

export async function downloadPdfBuffer(filePath: string): Promise<Buffer> {
  const sb = supabaseServer();
  const { data, error } = await sb.storage.from("pitch-decks").download(filePath);
  if (error || !data) throw error || new Error("Download failed");
  return Buffer.from(await data.arrayBuffer());
}