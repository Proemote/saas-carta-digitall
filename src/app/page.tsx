import { getMenuSections } from "@/lib/menu";
import MenuView from "@/components/public/MenuView";

export const revalidate = 60; // la carta se refresca cada minuto

export default async function CartaPage() {
  const sections = await getMenuSections();
  return <MenuView sections={sections} />;
}
