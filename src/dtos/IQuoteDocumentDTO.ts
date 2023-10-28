export interface IQuotesDocumentDTO {
  id: string;
  hashId: string;
  user_quote_id: string;
  quote_id: string;
  document_url: string;
  document_type_id: number;
  isPartnerDocument: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}
