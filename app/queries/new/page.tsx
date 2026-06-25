"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  full_name: string;
};

export default function NewQueryPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      const { data } = await supabase
        .from("members")
        .select("id, full_name")
        .order("full_name");

      if (data) {
        setMembers(data);
      }
    }

    loadMembers();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    const { data: issuer } = await supabase
      .from("members")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!issuer) {
      alert("Issuer record not found.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("queries")
      .insert({
        recipient_id: recipientId,
        issuer_id: issuer.id,
        subject,
        details,
        deadline,
        date_issued: new Date()
          .toISOString()
          .split("T")[0],
        status: "Pending",
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Query issued successfully.");

    router.push("/queries");
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-8">
        Issue Query
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6"
      >
        <div>
          <label className="block mb-2">
            Recipient
          </label>

          <select
            value={recipientId}
            onChange={(e) =>
              setRecipientId(e.target.value)
            }
            className="w-full border bg-black rounded p-3"
            required
          >
            <option value="">
              Select Member
            </option>

            {members.map((member) => (
              <option
                key={member.id}
                value={member.id}
              >
                {member.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Subject
          </label>

          <input
            type="text"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            className="w-full border bg-black rounded p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2">
            Details
          </label>

          <textarea
            value={details}
            onChange={(e) =>
              setDetails(e.target.value)
            }
            className="w-full border bg-black rounded p-3 min-h-[200px]"
            required
          />
        </div>

        <div>
          <label className="block mb-2">
            Deadline
          </label>

          <input
            type="date"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
            className="border bg-black rounded p-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border px-6 py-3 rounded hover:bg-gray-900"
        >
          {loading
            ? "Issuing..."
            : "Issue Query"}
        </button>
      </form>
    </main>
  );
}