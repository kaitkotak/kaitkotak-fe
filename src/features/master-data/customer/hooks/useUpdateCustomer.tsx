import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

const useUpdateCustomer = () => {
  const url: string = "/master/customers";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCustomer"],
    mutationFn: async (paylod: ICustomer) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: () => {
      navigate("/master/customer");
      queryClient.invalidateQueries({
        queryKey: ["masterCustomers"],
      });
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpdateCustomer;
