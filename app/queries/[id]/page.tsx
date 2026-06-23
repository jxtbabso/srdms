import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function QueryProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: query } = await supabase
    .from("queries")
    .select("*")
    .eq("id", id)
    .single();

  const { data: responses } = await supabase
    .from("query_responses")
    .select("*")
    .eq("query_id", id)
    .order("submitted_at", { ascending: false });

  if (!query) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold">
          Query Not Found
        </h1>

        <Link
          href="/queries"
          className="inline-block mt-6 border px-4 py-2 rounded"
        >
          Back to Queries
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold">
          Query Details
        </h1>

        <Link
          href="/queries"
          className="border px-4 py-2 rounded hover:bg-gray-900"
        >
          Back to Queries
        </Link>
      </div>

      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-bold mb-4">
          {query.subject}
        </h2>

        <p className="text-gray-300 mb-6">
          {query.details}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400">Status</p>
            <p className="font-semibold">
              {query.status}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Date Issued</p>
            <p>
              {query.date_issued}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Deadline</p>
            <p>
              {query.deadline}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">
        Responses
      </h2>

      <div className="space-y-4">
        {responses && responses.length > 0 ? (
          responses.map((response) => (
            <div
              key={response.id}
              className="border rounded-lg p-4"
            >
              <p className="mb-3">
                {response.response_text}
              </p>

              <p className="text-sm text-gray-400">
                Submitted:
                {" "}
                {response.submitted_at}
              </p>
            </div>
          ))
        ) : (
          <div className="border rounded-lg p-4">
            <p className="text-gray-400">
              No responses submitted yet.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          Submit Response
        </h2>

        <form>
          <textarea
            name="response"
            className="w-full bg-black border rounded-lg p-4 min-h-[150px]"
            placeholder="Enter your response..."
          />

          <button
            type="submit"
            className="mt-4 border px-6 py-2 rounded hover:bg-gray-900"
          >
            Submit Response
          </button>
        </form>
      </div>
    </main>
  );
}