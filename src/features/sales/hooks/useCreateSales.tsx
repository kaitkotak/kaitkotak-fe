import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";

const useCreateSales = () => {
  const url: string = "/invoice";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSales"],
    mutationFn: async (paylod: ISalesForm) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      navigate("/sales");
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
};

export default useCreateSales;
