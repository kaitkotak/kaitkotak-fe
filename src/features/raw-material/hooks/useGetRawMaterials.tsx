import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";
import { generateUrlWithParams } from "../../../libs/generateUrlWithParams";

const UseGetRawMaterials = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/material?`, props);
  return useQuery({
    queryKey: ["rawMaterials", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetRawMaterials;
