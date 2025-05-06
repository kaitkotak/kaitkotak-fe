import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

const useCreateCustomer = () => {
  const url: string = "/master/customers";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createCustomer"],
    mutationFn: async (paylod: ICustomer) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["masterCustomers"],
      });
      navigate("/master/customer");
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreateCustomer;
