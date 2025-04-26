interface IPurchaseOrderForm {
  id?: string;
  customer_id: number;
  order_date: string;
  order_number: string;
  tax: number;
  price_total: number;
  purchase_order_items: IPurchaseOrderItems[];
}

interface IPurchaseOrderItems {
  item_id: number;
  quantity: number;
  price_per_unit: number;
  price_total: number;
}

interface IPurchaseOrderList {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_code: string;
  order_date: string;
  order_number: string;
  tax: number;
  price_total: number;
  price_after_tax: number;
  purchase_order_items: IPurchaseOrderItems[];
}
