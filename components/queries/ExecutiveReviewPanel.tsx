"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  queryId: string;
};

export default function ExecutiveReviewPanel({
  queryId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(
    status:
      | "accepted"
      | "rejected"
      | "clarification_required"
  ) {
    setLoading(true);

    const { error } = await supabase
      .from("queries")
      .update({
        status,
      })
      .eq("id", queryId);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        Executive Review
      </h2>

      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => updateStatus("accepted")}
          disabled={loading}
        >
          ✓ Accept
        </Button>

        <Button
          onClick={() => updateStatus("rejected")}
          disabled={loading}
        >
          ✗ Reject
        </Button>

        <Button
          onClick={() =>
            updateStatus("clarification_required")
          }
          disabled={loading}
        >
          ↺ Request Clarification
        </Button>
      </div>
    </Card>
  );
}