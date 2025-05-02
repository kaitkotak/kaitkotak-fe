import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

const useUpdatePurchaseOrder = () => {
  const url: string = "/purchase_order";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updatePurchaseOrder"],
    mutationFn: async (paylod: IPurchaseOrderForm) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: (data) => {
      navigate("/purchase-order");
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrders"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useUpdatePurchaseOrder;
