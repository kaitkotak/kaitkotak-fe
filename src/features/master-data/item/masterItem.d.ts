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
  price_per_unit: number;
  cost_per_g: number;
  cost_per_kg: number;
  cost_per_unit: number;
  type: string;
  weight_g: number;
  customer_code: string;
  description: string;
  image?: string;
  customer: number;
  raw_material_quantity: number;
}

interface IItem {
  cost_per_g: number;
  cost_per_kg: number;
  cost_per_unit: number;
  customer_code: string;
  description: string;
  id: number;
  image: string;
  item_code: string;
  item_name: string;
  price_per_g: number;
  price_per_kg: number;
  price_per_unit: number;
  type: string;
  weight_g: number;
}

interface IItemList {
  id: number;
  item_name: string;
  item_code: string;
  price_per_unit: string;
  image: string;
  disabled?: boolean;
  purchase_number: string;
  stock: number;
}

interface IItemOpnamePayload {
  item_id: number;
  stock: number;
}

interface IItemOpnameForm {
  items: IItemList[];
}
