interface IPaymentForm {
  id: number;
  total_amount: number;
  customer_id: number;
  created_at: string;
  created_by: number;
  payment_items: IPaymentInvoice[];
}

interface IPaymentInvoice {
  id: number;
  invoice_id: number;
  invoice_number: number;
  amount: number;
}

interface IPaymentInvoiceList {
  id: number;
  price_total: number;
  amount_due: number;
  total_paid: number;
  payment_status: string;
  invoice_number: string;
  disabled: boolean;
  invoice_id: number;
}

interface IPaymentFormPayload {
  customer_id: number;
  payment_items: IPaymentItemsPayload[];
}

interface IPaymentItemsPayload {
  invoice_id: number;
  amount: number;
}
