export interface Payable {
  transactionDate: Date;
  pricePerUnit: number;
  quantity: number;
  documentId: string;
  fieldNames: string[];
  category: string;
  subCategory: string;
  comment: string;
  lastUpdate: Date;
}
