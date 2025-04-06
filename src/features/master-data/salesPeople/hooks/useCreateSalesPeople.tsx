import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";

const useCreateSalesPeople = () => {
  const url: string = "/master/sales_people";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSalesPeople"],
    mutationFn: async (paylod: ISalesPeople) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      navigate("/master/sales-people");
      queryClient.invalidateQueries({
        queryKey: ["masterSalesPeople"],
      });
    },
  });
};

export default useCreateSalesPeople;
