export interface Receivable {
  transactionDate: Date;
  documentId: string;
  fieldId: number;
  addedDate: Date;
  items: [string, number];
}
