import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

const UseGetPurchaseOrderList = () => {
  const url: string = `/purchase_order/all`;
  return useQuery({
    queryKey: ["purchaseOrderList"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetPurchaseOrderList;
