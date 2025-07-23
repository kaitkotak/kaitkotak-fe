import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";
import {generateUrlWithParams} from "../../../../libs/generateUrlWithParams.ts";

const UseGetCustomerList = (props?: ICustomerListParams) => {
  const url: string = generateUrlWithParams(`/master/customers/all?`, props);
  return useQuery({
    queryKey: ["masterCustomersList"],
    queryFn: async () => axiosInstance.get(url),
    refetchOnMount: false
  });
};

export default UseGetCustomerList;
