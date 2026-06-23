import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SearchParams = Promise<{
  q?: string | string[];
}>;

type MemberRecord = {
  id: string | number;
  [key: string]: unknown;
};

const memberFields = [
  { label: "Title", keys: ["title"] },
  { label: "Status", keys: ["status"] },
  { label: "Faculty", keys: ["faculty"] },
  { label: "Current level", keys: ["current_level", "currentLevel", "level"] },
  { label: "Year admitted", keys: ["year_admitted", "yearAdmitted", "admission_year"] },
];

function getFirstValue(member: MemberRecord, keys: string[]) {
  for (const key of keys) {
    if (key in member) {
      return member[key];
    }
  }

  const lowerCaseKeys = new Set(keys.map((key) => key.toLowerCase()));
  const matchingKey = Object.keys(member).find((key) =>
    lowerCaseKeys.has(key.toLowerCase())
  );

  return matchingKey ? member[matchingKey] : undefined;
}

function formatValue(value: unknown, fallback = "Not recorded") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(String).join(", ") : fallback;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getMemberName(member: MemberRecord) {
  return formatValue(
    getFirstValue(member, ["full_name", "fullName", "name"]),
    "Unnamed member"
  );
}

function getSearchText(member: MemberRecord) {
  const searchableValues = [
    getMemberName(member),
    ...memberFields.map((field) => formatValue(getFirstValue(member, field.keys), "")),
  ];

  return searchableValues.join(" ").toLowerCase();
}

function getSearchQuery(searchParams: Awaited<SearchParams>) {
  const rawQuery = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q;

  return rawQuery?.trim() ?? "";
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = getSearchQuery(params);
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("full_name", { ascending: true });

  const members = ((data ?? []) as MemberRecord[]).filter((member) =>
    query ? getSearchText(member).includes(query.toLowerCase()) : true
  );

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-400 transition hover:text-white"
            >
              Back to Dashboard
            </Link>
            <h1 className="mt-4 text-5xl font-bold">Members</h1>
            <p className="mt-3 text-gray-400">
              Sigma Club Records & Discipline Management System
            </p>
          </div>

          <p className="text-sm text-gray-500">
            {members.length} {members.length === 1 ? "record" : "records"}
          </p>
        </header>

        <form action="/members" className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search members"
            className="min-h-12 flex-1 rounded border border-gray-700 bg-zinc-950 px-4 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-400"
          />
          <button
            type="submit"
            className="min-h-12 rounded border border-gray-600 px-5 font-semibold transition hover:border-white hover:bg-white hover:text-black"
          >
            Search
          </button>
          {query && (
            <Link
              href="/members"
              className="flex min-h-12 items-center justify-center rounded border border-gray-800 px-5 font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white"
            >
              Clear
            </Link>
          )}
        </form>

        {error && (
          <div className="rounded border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error.message}
          </div>
        )}

        {!error && members.length === 0 && (
          <div className="rounded border border-gray-800 bg-zinc-950 p-6 text-gray-400">
            No members found.
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => {
            const profilePath = `/members/${encodeURIComponent(String(member.id))}`;

            return (
              <article
                key={String(member.id)}
                className="flex min-h-80 flex-col justify-between rounded border border-gray-800 bg-zinc-950 p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold leading-tight">
                        {getMemberName(member)}
                      </h2>
                      <p className="mt-2 text-sm uppercase tracking-wide text-gray-500">
                        {formatValue(getFirstValue(member, ["status"]), "Status pending")}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-6 grid gap-4 text-sm">
                    {memberFields.map((field) => (
                      <div
                        key={field.label}
                        className="border-t border-gray-800 pt-3"
                      >
                        <dt className="text-gray-500">{field.label}</dt>
                        <dd className="mt-1 font-medium text-gray-100">
                          {formatValue(getFirstValue(member, field.keys))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <Link
                  href={profilePath}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded border border-gray-600 px-4 font-semibold transition hover:border-white hover:bg-white hover:text-black"
                >
                  View Profile
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
