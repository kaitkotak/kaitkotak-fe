import { useQuery } from "@tanstack/react-query";
import { generateUrlWithParams } from "../../../../libs/generateUrlWithParams";
import axiosInstance from "../../../../libs/axios";

const UseGetItems = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/master/items?`, props);
  return useQuery({
    queryKey: ["masterItems", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetItems;
