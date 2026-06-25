export type QueryStatus =
  | "pending"
  | "responded"
  | "under_review"
  | "resolved"
  | "rejected"
  | "clarification_requested";

export interface Query {
  id: string;
  recipient_id: string;
  issuer_id: string;
  subject: string;
  details: string;
  date_issued: string;
  deadline: string;
  status: QueryStatus;
}