import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

interface IProps {
  id: string;
}

const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["deleteCustomer"],
    mutationFn: async (params: IProps) => {
      const url: string = `/master/customers/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["masterCustomers"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useDeleteCustomer;
