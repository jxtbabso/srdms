import { supabase } from "@/lib/supabase";

export async function getQueries() {
  const { data, error } = await supabase
    .from("queries")
    .select("*")
    .order("date_issued", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getQueryById(id: string) {
  const { data, error } = await supabase
    .from("queries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createQuery(query: {
  recipient_id: string;
  issuer_id: string;
  subject: string;
  details: string;
  deadline: string;
}) {
  const { error } = await supabase
    .from("queries")
    .insert({
      ...query,
      status: "pending",
      date_issued: new Date().toISOString().split("T")[0],
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateQueryStatus(
  id: string,
  status:
    | "pending"
    | "responded"
    | "under_review"
    | "resolved"
    | "rejected"
    | "clarification_requested"
) {
  const { error } = await supabase
    .from("queries")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}