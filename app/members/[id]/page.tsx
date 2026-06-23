import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type MemberRecord = {
  id: string | number;
  [key: string]: unknown;
};

type RelatedRecord = {
  [key: string]: unknown;
};

const fieldLabels: Record<string, string> = {
  id: "Member ID",
  full_name: "Full name",
  title: "Title",
  status: "Status",
  faculty: "Faculty",
  current_level: "Current level",
  year_admitted: "Year admitted",
  graduation_year: "Graduation year",
  sigma_years_spent: "Sigma years spent",
  profile_photo: "Profile photo",
  profile_photo_url: "Profile photo",
  photo_url: "Profile photo",
};

const photoKeys = [
  "profile_photo_url",
  "profile_photo",
  "photo_url",
  "avatar_url",
  "image_url",
];

const positionKeys = [
  "positions_held",
  "positions",
  "held_positions",
  "member_positions",
  "leadership_positions",
];

const committeeKeys = [
  "committees",
  "committee_memberships",
  "member_committees",
  "sigma_committees",
];

function getFirstValue(record: RelatedRecord, keys: string[]) {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }

  const lowerCaseKeys = new Set(keys.map((key) => key.toLowerCase()));
  const matchingKey = Object.keys(record).find((key) =>
    lowerCaseKeys.has(key.toLowerCase())
  );

  return matchingKey ? record[matchingKey] : undefined;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formatLabel(key: string) {
  const knownLabel = fieldLabels[key];

  if (knownLabel) {
    return knownLabel;
  }

  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");

  return spaced.replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatValue(value: unknown, fallback = "Not recorded") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    const values = value.map((item) => formatListItem(item)).filter(Boolean);
    return values.length > 0 ? values.join(", ") : fallback;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function formatListItem(item: unknown) {
  if (item === null || item === undefined || item === "") {
    return "";
  }

  if (typeof item !== "object") {
    return String(item);
  }

  const record = item as RelatedRecord;
  const primary = getFirstValue(record, [
    "title",
    "name",
    "position",
    "role",
    "committee",
    "committee_name",
    "position_title",
  ]);
  const start = getFirstValue(record, ["start_year", "year_started", "from", "year"]);
  const end = getFirstValue(record, ["end_year", "year_ended", "to"]);
  const years = [start, end]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .map(String);

  if (primary) {
    return years.length > 0
      ? `${String(primary)} (${years.join(" - ")})`
      : String(primary);
  }

  return JSON.stringify(record);
}

function toDisplayList(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(formatListItem).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[;,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [formatListItem(value)].filter(Boolean);
}

function getMemberName(member: MemberRecord) {
  return formatValue(
    getFirstValue(member, ["full_name", "fullName", "name"]),
    "Unnamed member"
  );
}

function getDetailEntries(member: MemberRecord) {
  return Object.entries(member)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .sort(([leftKey], [rightKey]) => {
      const priority = [
        "id",
        "full_name",
        "title",
        "status",
        "faculty",
        "current_level",
        "year_admitted",
        "graduation_year",
        "sigma_years_spent",
      ];

      const leftIndex = priority.indexOf(leftKey);
      const rightIndex = priority.indexOf(rightKey);

      if (leftIndex === -1 && rightIndex === -1) {
        return leftKey.localeCompare(rightKey);
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    });
}

async function fetchRelatedRows(tableName: string, memberId: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("member_id", memberId);

  if (error || !data) {
    return [];
  }

  return data as RelatedRecord[];
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="rounded border border-gray-800 bg-black p-4">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-2 break-words font-medium text-gray-100">
        {formatValue(value)}
      </dd>
    </div>
  );
}

function ListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded border border-gray-800 bg-zinc-950 p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3 text-gray-200">
          {items.map((item) => (
            <li key={item} className="border-t border-gray-800 pt-3">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-500">Not recorded</p>
      )}
    </section>
  );
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memberQuery = supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const positionsQuery = fetchRelatedRows("member_positions", id);
  const committeesQuery = fetchRelatedRows("member_committees", id);

  const [{ data: member, error }, relatedPositions, relatedCommittees] =
    await Promise.all([memberQuery, positionsQuery, committeesQuery]);

  if (error) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-400 transition hover:text-white"
          >
            Back to Dashboard
          </Link>
          <div className="mt-8 rounded border border-red-900 bg-red-950/40 p-6 text-red-300">
            {error.message}
          </div>
        </div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-400 transition hover:text-white"
          >
            Back to Dashboard
          </Link>
          <div className="mt-8 rounded border border-gray-800 bg-zinc-950 p-6">
            <h1 className="text-3xl font-bold">Member not found</h1>
            <Link
              href="/members"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded border border-gray-600 px-4 font-semibold transition hover:border-white hover:bg-white hover:text-black"
            >
              View Members
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const memberRecord = member as MemberRecord;
  const photoUrl = getFirstValue(memberRecord, photoKeys);
  const positions = [
    ...toDisplayList(getFirstValue(memberRecord, positionKeys)),
    ...relatedPositions.map(formatListItem).filter(Boolean),
  ];
  const committees = [
    ...toDisplayList(getFirstValue(memberRecord, committeeKeys)),
    ...relatedCommittees.map(formatListItem).filter(Boolean),
  ];
  const sigmaYearsSpent = getFirstValue(memberRecord, [
    "sigma_years_spent",
    "sigma_years",
    "years_spent",
    "years_in_sigma",
  ]);
  const graduationYear = getFirstValue(memberRecord, [
    "graduation_year",
    "year_graduated",
    "graduating_year",
  ]);

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4">
          <nav className="flex flex-wrap gap-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className="text-gray-400 transition hover:text-white"
            >
              Back to Dashboard
            </Link>
            <Link href="/members" className="text-gray-400 transition hover:text-white">
              Members
            </Link>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-end">
            <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded border border-gray-800 bg-zinc-950 lg:h-56 lg:w-56">
              {isNonEmptyString(photoUrl) ? (
                <Image
                  src={photoUrl}
                  alt={`${getMemberName(memberRecord)} profile photo`}
                  fill
                  sizes="(min-width: 1024px) 224px, 100vw"
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-center text-sm text-gray-600">
                  No photo available
                </span>
              )}
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Member Profile
              </p>
              <h1 className="mt-3 text-5xl font-bold leading-tight">
                {getMemberName(memberRecord)}
              </h1>
              <p className="mt-4 max-w-2xl text-gray-400">
                {formatValue(getFirstValue(memberRecord, ["title"]), "Title not recorded")}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailCard
            label="Status"
            value={getFirstValue(memberRecord, ["status"])}
          />
          <DetailCard
            label="Current level"
            value={getFirstValue(memberRecord, ["current_level", "level"])}
          />
          <DetailCard label="Sigma years spent" value={sigmaYearsSpent} />
          <DetailCard label="Graduation year" value={graduationYear} />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <ListSection title="Positions Held" items={positions} />
          <ListSection title="Committees" items={committees} />
        </div>

        <section className="rounded border border-gray-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">Member Information</h2>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            {getDetailEntries(memberRecord).map(([key, value]) => (
              <DetailCard key={key} label={formatLabel(key)} value={value} />
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
