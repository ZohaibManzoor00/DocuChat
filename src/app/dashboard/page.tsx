import { DocumentsList } from "@/components/documents-list";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="bg-primary/10">
      <DocumentsList />
    </div>
  )
}
