import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

const useCreatePurchaseOrder = () => {
  const url: string = "/purchase_order";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createPurchaseOrder"],
    mutationFn: async (paylod: IPurchaseOrderForm) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      navigate("/purchase-order");
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrder"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreatePurchaseOrder;
