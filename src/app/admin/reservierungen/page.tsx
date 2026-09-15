import { ReservationsAdmin } from "@/components/admin/ReservationsAdmin";

export default function AdminReservierungenPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-blue mb-2">Reservierungen</h1>
      <p className="text-sm text-brand-ink/70 mb-8">
        Filtern, bestätigen, stornieren oder als abgeschlossen markieren. Bei Bestätigung/Storno
        wird der Gast per E-Mail informiert (sofern Resend konfiguriert ist).
      </p>
      <ReservationsAdmin />
    </div>
  );
}
