interface ITableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

interface IItemnForm {
  id: string;
  item_name: string;
  item_code: string;
  price_per_g: number;
  price_per_kg: number;
  cost_per_g: number;
  cost_per_kg: number;
  type: string;
  weight_g: number;
  customer_code: string;
  description: string;
  image?: string;
}
