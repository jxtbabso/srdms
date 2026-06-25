"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  queryId: string;
  existingResponse?: string;
};

export default function ResponseForm({
  queryId,
  existingResponse,
}: Props) {
  const router = useRouter();

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingResponse) {
      setResponse(existingResponse);
    }
  }, [existingResponse]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in.");
      setLoading(false);
      return;
    }

    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!member) {
      alert("Member record not found.");
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from("query_responses")
      .select("id")
      .eq("query_id", queryId)
      .eq("responder_id", member.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("query_responses")
        .update({
          response_text: response,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("query_responses")
        .insert({
          query_id: queryId,
          responder_id: member.id,
          response_text: response,
          submitted_at: new Date().toISOString(),
        });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
    }

    await supabase
      .from("queries")
      .update({
        status: "responded",
      })
      .eq("id", queryId);

    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">
        {existingResponse ? "Edit Response" : "Submit Response"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full rounded-lg border bg-black p-4 min-h-[180px]"
          placeholder="Enter your response..."
          required
        />

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : existingResponse
            ? "Update Response"
            : "Submit Response"}
        </Button>
      </form>
    </Card>
  );
}