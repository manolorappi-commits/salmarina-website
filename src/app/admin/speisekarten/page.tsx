import { MenusAdmin } from "@/components/admin/MenusAdmin";

export default function AdminSpeisekartenPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-blue mb-2">Speisekarten</h1>
      <p className="text-sm text-brand-ink/70 mb-8">
        Bilder und PDFs für Speisekarte, Monatskarte, Mittagsmenü und Menüvorschläge hochladen.
      </p>
      <MenusAdmin />
    </div>
  );
}
