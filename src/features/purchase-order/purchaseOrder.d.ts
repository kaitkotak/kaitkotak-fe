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
