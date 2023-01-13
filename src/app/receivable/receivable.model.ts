export interface Receivable {
  ajuste?: ReceivablePhase;
  preliquidation?: ReceivablePhase;
  liquidation?: ReceivablePhase;
  name?: string;
}

export interface ReceivablePhase {
  ingenioId?: string;
  pricePerUnit?: number;
  tons?: number;
  total?: number;
}
