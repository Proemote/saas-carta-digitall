export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ChatbotManager from "@/components/admin/ChatbotManager";
import type { ChatbotFaq, ChatbotConversation, ChatbotMessage, Reservation, ChatbotConfig } from "@/lib/types";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function ChatbotPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  const supabase = await createClient();

  const [faqsRes, conversationsRes, messagesRes, reservationsRes, configRes] = await Promise.all([
    supabase.from("chatbot_faqs").select("*"),
    supabase.from("chatbot_conversations").select("*"),
    supabase.from("chatbot_messages").select("*"),
    supabase.from("reservations").select("*").eq("source", "chatbot"),
    supabase.from("chatbot_config").select("*").maybeSingle(),
  ]);

  const faqs = (faqsRes.data as ChatbotFaq[]) || [];
  const conversations = (conversationsRes.data as ChatbotConversation[]) || [];
  const messages = (messagesRes.data as ChatbotMessage[]) || [];
  const botReservations = (reservationsRes.data as Reservation[]) || [];
  const config = (configRes.data as ChatbotConfig) || { id: "", is_active: false, business_instructions: "" };

  return (
    <ChatbotManager
      faqs={faqs}
      conversations={conversations}
      messages={messages}
      botReservations={botReservations}
      config={config}
    />
  );
}
