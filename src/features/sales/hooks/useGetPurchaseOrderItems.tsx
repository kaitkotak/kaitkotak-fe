import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

const UseGetPurchaseOrderItems = () => {
  const url: string = `/purchase_order/items`;
  return useMutation({
    mutationKey: ["purchaseOrderItems"],
    mutationFn: async (customerId: string) => {
      return await axiosInstance.get(`${url}/${customerId}`);
    },
  });
};

export default UseGetPurchaseOrderItems;
