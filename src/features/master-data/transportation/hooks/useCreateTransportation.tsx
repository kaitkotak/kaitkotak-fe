import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

const useCreateTransportation = () => {
  const url: string = "/master/transport_vehicle";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createTransportation"],
    mutationFn: async (paylod: ITransportationForm) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      navigate("/master/transportation");
      queryClient.invalidateQueries({
        queryKey: ["masterTransportation"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreateTransportation;
