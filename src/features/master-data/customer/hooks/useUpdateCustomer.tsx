import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

const useUpdateCustomer = () => {
  const url: string = "/master/customers";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updateCustomer"],
    mutationFn: async (paylod: ICustomer) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: (data) => {
      navigate("/master/customer");
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

export default useUpdateCustomer;
