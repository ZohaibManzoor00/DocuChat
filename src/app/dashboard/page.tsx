import { DocumentsList } from "@/components/documents-list";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="h-full max-w-7xl mx-auto bg-secondary">
      <h1 className="text-3xl p-5 font-extralight">
        My Documents
      </h1>
      <DocumentsList />
    </div>
  )
}
