import { useQuery } from "@tanstack/react-query";
import { generateUrlWithParams } from "../../../libs/generateUrlWithParams";
import { axiosInstance } from "../../../libs/axios";

const UseGetUsers = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/user?`, props);
  return useQuery({
    queryKey: ["users", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetUsers;
