import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";
import { generateUrlWithParams } from "../../../libs/generateUrlWithParams";

const UseGetProductions = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/production?`, props);
  return useQuery({
    queryKey: ["productions", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetProductions;
