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
}

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
  invoice_items: ISalesItem[];
  po_id: number;
  invoice_number;
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
