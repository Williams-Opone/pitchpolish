import ChatUI from "@/components/ChatUI";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatUI deckId={id} />;
}