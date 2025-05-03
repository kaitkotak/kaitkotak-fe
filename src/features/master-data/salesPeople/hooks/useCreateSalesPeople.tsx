import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

const useCreateSalesPeople = () => {
  const url: string = "/master/sales_people";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createSalesPeople"],
    mutationFn: async (paylod: ISalesPeople) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      navigate("/master/sales-people");
      queryClient.invalidateQueries({
        queryKey: ["masterSalesPeople"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreateSalesPeople;
