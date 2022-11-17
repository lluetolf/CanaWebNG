export interface Receivable {
  ajuste?: ReceivablePhase;
  preliquidation?: ReceivablePhase;
  liquidation?: ReceivablePhase;
}

export interface ReceivablePhase {
  ingenioId?: string;
  pricePerUnit?: number;
  tons?: number;
  total?: number;
}
