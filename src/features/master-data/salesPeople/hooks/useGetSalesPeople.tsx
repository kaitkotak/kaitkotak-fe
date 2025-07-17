import { useQuery } from "@tanstack/react-query";
import { generateUrlWithParams } from "../../../../libs/generateUrlWithParams";
import axiosInstance from "../../../../libs/axios";

const UseGetSalesPeople = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/master/sales_people?`, props);

  return useQuery({
    queryKey: ["masterSalesPeople", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetSalesPeople;
