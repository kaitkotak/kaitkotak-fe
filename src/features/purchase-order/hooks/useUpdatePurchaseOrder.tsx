import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { axiosInstance } from "../../../libs/axios";

const useUpdatePurchaseOrder = () => {
  const url: string = "/purchase_order";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePurchaseOrder"],
    mutationFn: async (paylod: IPurchaseOrderForm) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: () => {
      navigate("/purchase-order");
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrders"],
      });
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpdatePurchaseOrder;
