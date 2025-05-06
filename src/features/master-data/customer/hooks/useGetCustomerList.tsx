import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";

const UseGetCustomerList = () => {
  const url: string = `/master/customers/all`;
  return useQuery({
    queryKey: ["masterCustomersList"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetCustomerList;
