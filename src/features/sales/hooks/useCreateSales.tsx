import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

const useCreateSales = () => {
  const url: string = "/invoice";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createSales"],
    mutationFn: async (paylod: ISalesForm) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      navigate("/sales");
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreateSales;
