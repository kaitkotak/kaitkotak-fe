interface ISales {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_code: string;
  sales_rep_name: string;
  purchase_order_id: number;
  purchase_order_no: string;
  driver_name: string;
  vehicle_number: string;
  driver_number: string;
  invoice_date: string;
  tax: number;
  due_date: string;
  due_days: number;
  price_total: number;
  price_after_tax: number;
  payment_status: PaymentStatus;
}

type PaymentStatus = "Belum Dibayar" | "Belum Lunas" | "Lunas";

interface ISalesForm {
  id: string;
  customer_id: number;
  customer_name: string;
  customer_code: string;
  customer_address: string;
  sales_rep_id: number;
  sales_rep_name: string;
  purchase_order_id: number;
  purchase_order_no: string;
  transport_vehicle_id: number;
  driver_name: string;
  vehicle_number: string;
  driver_number: string;
  invoice_date: string;
  tax: number;
  due_date: string;
  due_days: number;
  price_total: number;
  price_after_tax: number;
  invoice_items: ISalesItemList[];
  po_id: number;
  invoice_number: string;
}

interface ISalesItem {
  id: number;
  item_id: number;
  item_name: string;
  item_code: string;
  item_description: string;
  quantity: number;
  price_total: number;
  price_per_unit: number;
  po_item_id: number;
}

interface ISalesItemList {
  id: string;
  item_id: number;
  item_name: string;
  po_id: number;
  po_number: string;
  price_per_unit: number;
  price_total: number;
  quantity: number;
  remaining_quantity: number;
  disabled: boolean;
}

interface ISalesPurchaseOrderList {
  id: string;
  item_id: number;
  item_name: string;
  price_per_unit: number;
  price_total: number;
  quantity: number;
  remaining_quantity: number;
}

interface ISalesFormPayload {
  customer_id: number;
  invoice_date: string;
  due_date: string;
  due_days: number;
  tax: number;
  sales_rep_id: number;
  transport_vehicle_id: number;
  invoice_items: ISalesFormPayloadItem[];
}

interface ISalesFormPayloadItem {
  po_id: number;
  item_id: number;
  quantity: number;
  price_per_unit: number;
  price_total: number;
}
