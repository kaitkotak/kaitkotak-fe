import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

const UseGetProduction = (id: string) => {
  const url: string = `/production/${id}`;
  return useQuery({
    queryKey: ["production", id],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetProduction;
