import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";

const useCreateCustomer = () => {
  const url: string = "/master/customers";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCustomer"],
    mutationFn: async (paylod: ICustomer) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["masterCustomers"],
      });
      navigate("/master/customer");
    },
  });
};

export default useCreateCustomer;
