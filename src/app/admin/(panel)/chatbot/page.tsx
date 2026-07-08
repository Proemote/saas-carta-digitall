import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import ChatbotManager from "@/components/admin/ChatbotManager";
import type {
  ChatbotFaq,
  ChatbotConversation,
  ChatbotMessage,
  Reservation,
} from "@/lib/types";

export default async function ChatbotPage() {
  if (!supabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const [faqsRes, convsRes, msgsRes, botResRes] = await Promise.all([
    supabase.from("chatbot_faqs").select("*").order("sort_order"),
    supabase
      .from("chatbot_conversations")
      .select("*")
      .order("last_message_at", { ascending: false })
      .limit(20),
    supabase
      .from("chatbot_messages")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("reservations")
      .select("*")
      .eq("source", "chatbot")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <ChatbotManager
      faqs={(faqsRes.data as ChatbotFaq[]) ?? []}
      conversations={(convsRes.data as ChatbotConversation[]) ?? []}
      messages={(msgsRes.data as ChatbotMessage[]) ?? []}
      botReservations={(botResRes.data as Reservation[]) ?? []}
    />
  );
}
