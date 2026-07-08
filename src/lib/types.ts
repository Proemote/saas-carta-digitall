export type PriceType = "single" | "double" | "per_unit" | "no_price";
export type ReservationStatus = "pending" | "confirmed" | "cancelled";
export type RecordSource = "manual" | "chatbot";

export interface Category {
  id: string;
  name: string;
  name_en: string | null;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  image_url: string | null;
  price_type: PriceType;
  price: number | null;
  price_tapa: number | null;
  price_plato: number | null;
  price_unit: number | null;
  allergens: string[];
  is_available: boolean;
  sort_order: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  source: RecordSource;
  created_at: string;
}

export interface Reservation {
  id: string;
  customer_id: string | null;
  customer_name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  party_size: number;
  status: ReservationStatus;
  notes: string | null;
  source: RecordSource;
  created_at: string;
}

export interface Visit {
  id: string;
  customer_id: string;
  visit_date: string;
  amount: number | null;
  notes: string | null;
}

export interface ChatbotFaq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface ChatbotConversation {
  id: string;
  customer_id: string | null;
  customer_phone: string | null;
  customer_name: string | null;
  started_at: string;
  last_message_at: string;
}

export interface ChatbotMessage {
  id: string;
  conversation_id: string;
  role: "user" | "bot";
  content: string;
  created_at: string;
}

export interface ContentGeneration {
  id: string;
  format: string;
  objective: string;
  context: string | null;
  result: GeneratedContent;
  created_at: string;
}

export interface GeneratedContent {
  concepto: string;
  guion: string;
  caption: string;
  hashtags: string[];
}

/** Categoría con sus productos y subcategorías ya resueltos (para la carta pública) */
export interface MenuSection {
  category: Category;
  products: Product[];
  children: { category: Category; products: Product[] }[];
}
