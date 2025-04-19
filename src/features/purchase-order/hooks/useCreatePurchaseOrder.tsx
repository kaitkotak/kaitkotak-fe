import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";

const useCreatePurchaseOrder = () => {
  const url: string = "/purchase_order";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createPurchaseOrder"],
    mutationFn: async (paylod: IPurchaseOrderForm) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      navigate("/purchase-order");
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrder"],
      });
    },
  });
};

export default useCreatePurchaseOrder;
