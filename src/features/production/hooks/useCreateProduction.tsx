import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

const useCreateProduction = () => {
  const url: string = "/production";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createProduction"],
    mutationFn: async (paylod: IProductionPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      navigate("/production");
      queryClient.invalidateQueries({
        queryKey: ["productions"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreateProduction;
