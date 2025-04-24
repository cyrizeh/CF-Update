import { ListResponse } from './ListResponse.type';

export interface BillingStatementResponse extends ListResponse {
  items: Array<BillingStatement>;
}

interface BillingStatement {
  paymentId: string;
  fileName: string;
  date: string;
  statementNumber: string;
  status: string;
}
