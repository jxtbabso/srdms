import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Dashboard() {
  const { count: memberCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  const { count: fumblingCount } = await supabase
    .from("fumblings")
    .select("*", { count: "exact", head: true });

  const { count: queryCount } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true });

  const { count: disciplineCount } = await supabase
    .from("disciplinary_actions")
    .select("*", { count: "exact", head: true });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-8">
        SRDMS Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <Link href="/members" className="block">
          <div className="border p-6 rounded-lg cursor-pointer hover:bg-gray-900 transition">
            <h2 className="text-xl">Members</h2>
            <p className="text-4xl font-bold">
              {memberCount ?? 0}
            </p>
          </div>
        </Link>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl">Fumblings</h2>
          <p className="text-4xl font-bold">
            {fumblingCount ?? 0}
          </p>
        </div>

        <Link href="/queries" className="block">
          <div className="border p-6 rounded-lg cursor-pointer hover:bg-gray-900 transition">
            <h2 className="text-xl">Queries</h2>
            <p className="text-4xl font-bold">
              {queryCount ?? 0}
            </p>
          </div>
        </Link>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl">Disciplinary Actions</h2>
          <p className="text-4xl font-bold">
            {disciplineCount ?? 0}
          </p>
        </div>
      </div>
    </main>
  );
}