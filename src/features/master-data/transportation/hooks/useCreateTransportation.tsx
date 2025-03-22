import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";

const useCreateTransportation = () => {
  const url: string = "/master/transport_vehicle";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTransportation"],
    mutationFn: async (paylod: ITransportationForm) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      navigate("/master/transportation");
      queryClient.invalidateQueries({
        queryKey: ["masterTransportation"],
      });
    },
  });
};

export default useCreateTransportation;
