export interface Payable {
  transactionDate: Date;
  pricePerUnit: number;
  quantity: number;
  documentId: string;
  fieldId: number;
  category: string;
  subCategory: string;
  comment: string;
  lastUpdate: Date;
}
