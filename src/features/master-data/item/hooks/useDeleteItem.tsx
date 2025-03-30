import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

interface IProps {
  id: number;
}

const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const [messageApi, _] = message.useMessage();

  return useMutation({
    mutationKey: ["deleteItem"],
    mutationFn: async (params: IProps) => {
      const url: string = `/master/items/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "test",
      });
      queryClient.invalidateQueries({
        queryKey: ["masterItems"],
      });
    },
  });
};

export default useDeleteItem;
