import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

const UseGetPayment = (id: string) => {
  const url: string = `/payment/${id}`;
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetPayment;
