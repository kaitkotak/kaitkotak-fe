import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

interface IProps {
  id: string;
}

const useDeleteSalesPeople = () => {
  const queryClient = useQueryClient();
  const [messageApi, _] = message.useMessage();

  return useMutation({
    mutationKey: ["deleteSalesPeople"],
    mutationFn: async (params: IProps) => {
      const url: string = `/master/sales_people/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "test",
      });
      queryClient.invalidateQueries({
        queryKey: ["masterSalesPeople"],
      });
    },
  });
};

export default useDeleteSalesPeople;
