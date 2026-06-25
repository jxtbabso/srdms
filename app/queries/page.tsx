import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function QueriesPage() {
  const { data: queries, error } = await supabase
    .from("queries")
    .select("*")
    .order("date_issued", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-6">Queries</h1>
        <p>Error loading queries.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold">
            Queries
          </h1>
        </div>

        <div className="flex gap-4">
          <Link
            href="/queries/new"
            className="border px-4 py-2 rounded hover:bg-gray-900"
          >
            Issue Query
          </Link>

          <Link
            href="/dashboard"
            className="border px-4 py-2 rounded hover:bg-gray-900"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {queries?.map((query) => (
          <div
            key={query.id}
            className="border rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-3">
              {query.subject}
            </h2>

            <p className="text-gray-300 mb-4">
              {query.details}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-gray-400">Status</p>
                <p>{query.status}</p>
              </div>

              <div>
                <p className="text-gray-400">Issued</p>
                <p>{query.date_issued}</p>
              </div>

              <div>
                <p className="text-gray-400">Deadline</p>
                <p>{query.deadline}</p>
              </div>
            </div>

            <Link
              href={`/queries/${query.id}`}
              className="inline-block border px-4 py-2 rounded hover:bg-gray-900"
            >
              View Query
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}