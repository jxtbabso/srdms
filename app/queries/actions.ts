"use server";

import { supabase } from "@/lib/supabase";

export async function submitResponse(
  queryId: string,
  responseText: string,
  responderId: string
) {
  const { error } = await supabase
    .from("query_responses")
    .insert({
      query_id: queryId,
      responder_id: responderId,
      response_text: responseText,
      submitted_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(error.message);
  }

  const { error: updateError } = await supabase
    .from("queries")
    .update({
      status: "responded",
    })
    .eq("id", queryId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return true;
}