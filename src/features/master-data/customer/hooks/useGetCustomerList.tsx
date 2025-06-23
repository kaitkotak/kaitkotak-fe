import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";
import {generateUrlWithParams} from "../../../../libs/generateUrlWithParams.ts";

const UseGetCustomerList = (props?: ICustomerListParams) => {
  // const url: string = `/master/customers/all`;
  const url: string = generateUrlWithParams(`/master/customers?`, props);
  return useQuery({
    queryKey: ["masterCustomersList"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetCustomerList;
