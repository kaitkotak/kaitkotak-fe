import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

const UseGetPermissionList = () => {
  const url: string = `/user/permissions`;
  return useQuery({
    queryKey: ["permission"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetPermissionList;
