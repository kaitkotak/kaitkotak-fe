import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";
import { generateUrlWithParams } from "../../../libs/generateUrlWithParams";

const UseGetSales = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/invoice?`, props);
  return useQuery({
    queryKey: ["sales", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetSales;
