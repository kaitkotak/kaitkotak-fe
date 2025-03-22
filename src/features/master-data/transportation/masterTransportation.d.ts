interface ITableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

interface ITransportationForm {
  id: strinf;
  driver_name: string;
  phone_number: string;
  vehicle_number: strinf;
}
