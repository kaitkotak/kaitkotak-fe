import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

interface IProps {
  id: string;
}

const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const [messageApi, _] = message.useMessage();

  return useMutation({
    mutationKey: ["deleteCustomer"],
    mutationFn: async (params: IProps) => {
      const url: string = `/master/customers/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["masterCustomers"],
      });
      messageApi.open({
        type: "success",
        content: "test",
      });
    },
  });
};

export default useDeleteCustomer;
