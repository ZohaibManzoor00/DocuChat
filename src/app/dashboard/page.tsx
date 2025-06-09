import { DocumentsList } from "@/components/documents-list";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="h-full max-w-7xl mx-auto pt-3">
      <DocumentsList />
    </div>
  );
}
