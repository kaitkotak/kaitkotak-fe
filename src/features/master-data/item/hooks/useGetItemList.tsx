import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";

const UseGetItemList = () => {
  const url: string = `/master/items/all`;
  return useQuery({
    queryKey: ["masterItemsList"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetItemList;
