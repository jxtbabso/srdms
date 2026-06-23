import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: members, error } = await supabase
    .from("members")
    .select("*");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-6">SRDMS</h1>

      <p className="mb-8 text-gray-400">
        Sigma Club Records & Discipline Management System
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        Members
      </h2>

      {error && (
        <p className="text-red-500">
          {error.message}
        </p>
      )}

      <div className="space-y-3">
        {members?.map((member) => (
          <div
            key={member.id}
            className="border border-gray-700 p-4 rounded"
          >
            <p className="font-bold">
              {member.full_name}
            </p>

            <p>
              {member.status}
            </p>

            <p className="text-gray-400">
              {member.title}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}