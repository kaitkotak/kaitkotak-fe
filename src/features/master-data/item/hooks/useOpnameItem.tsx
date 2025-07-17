import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

const useOpnameItem = () => {
  const url: string = "/master/items/stock_opname";
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["opnameItem"],
    mutationFn: async (paylod: IItemOpnamePayload[]) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["masterItems"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useOpnameItem;
