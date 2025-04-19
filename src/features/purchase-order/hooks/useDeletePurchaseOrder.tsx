import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { axiosInstance } from "../../../libs/axios";

interface IProps {
  id: number;
}

const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();
  const [messageApi, _] = message.useMessage();

  return useMutation({
    mutationKey: ["deletePurchaseOrder"],
    mutationFn: async (params: IProps) => {
      const url: string = `/purchase_order/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "test",
      });
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrders"],
      });
    },
  });
};

export default useDeletePurchaseOrder;
