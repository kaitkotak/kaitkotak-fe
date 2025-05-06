import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";

const UseGetSalesPeopleList = () => {
  const url: string = `/master/sales_people/all`;
  return useQuery({
    queryKey: ["masterSalesPeopleList"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetSalesPeopleList;
