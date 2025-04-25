import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { axiosInstance } from "../../../libs/axios";

interface IProps {
  id: number;
}

const useDeleteSales = () => {
  const queryClient = useQueryClient();
  const [messageApi, _] = message.useMessage();

  return useMutation({
    mutationKey: ["deleteSales"],
    mutationFn: async (params: IProps) => {
      const url: string = `/invoice/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "test",
      });
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
};

export default useDeleteSales;
