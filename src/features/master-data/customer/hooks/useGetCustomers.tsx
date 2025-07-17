import { useQuery } from "@tanstack/react-query";
import { generateUrlWithParams } from "../../../../libs/generateUrlWithParams";
import axiosInstance from "../../../../libs/axios";

const UseGetCustomers = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/master/customers?`, props);
  return useQuery({
    queryKey: ["masterCustomers", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetCustomers;
