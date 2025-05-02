import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

interface IProps {
  id: string;
}

const useDeleteSalesPeople = () => {
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["deleteSalesPeople"],
    mutationFn: async (params: IProps) => {
      const url: string = `/master/sales_people/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: (data) => {
      message.success({
        content: data.data.message,
        duration: 3,
      });
      queryClient.invalidateQueries({
        queryKey: ["masterSalesPeople"],
      });
    },
  });
};

export default useDeleteSalesPeople;
