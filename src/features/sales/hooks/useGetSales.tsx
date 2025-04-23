import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";
import { generateUrlWithParams } from "../../../libs/generateUrlWithParams";

const UseGetSales = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/purchase_order?`, props);
  return useQuery({
    queryKey: ["purchaseOrders", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetSales;
