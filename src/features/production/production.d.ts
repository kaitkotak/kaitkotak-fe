interface IProductionItem {
  id: number;
  quantity: number;
  image: string;
  name: string;
  code: string;
}

interface IProductionPayload {
  production_date: string;
  production_items: {
    item_id: number;
    quantity: number;
  }[];
}

interface IProduction {
  id: number;
  production_date: string;
  production_items: IProductionItemResponse[];
  total_quantity: number;
}

interface IProductionItemResponse {
  id: number;
  item_id: number;
  item_name: string;
  quantity: number;
}
