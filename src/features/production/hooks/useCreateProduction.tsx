import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";

const useCreateProduction = () => {
  const url: string = "/production";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProduction"],
    mutationFn: async (paylod: IProductionPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      navigate("/production");
      queryClient.invalidateQueries({
        queryKey: ["productions"],
      });
    },
  });
};

export default useCreateProduction;
