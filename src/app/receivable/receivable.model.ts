export interface Receivable {
  ajuste?: ReceivablePhase;
  preliquidation?: ReceivablePhase;
  liquidation?: ReceivablePhase;
  ingenioId?: string;
  harvest?: string;
}

export interface ConsolidatedReceivable {
  receivables: Receivable[];
  name?: string;
}

export interface ReceivablePhase {
  ingenioId?: string;
  pricePerUnit?: number;
  tons?: number;
  total?: number;
  deductible?: number;
}
