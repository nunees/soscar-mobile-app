export interface IQuotesDocumentDTO {
  id: string;
  hashId: string;
  user_quote_id: string;
  quote_id: string;
  document_url: string;
  document_type_id: number;
  created_at: Date | null;
  updated_at: Date | null;
}
