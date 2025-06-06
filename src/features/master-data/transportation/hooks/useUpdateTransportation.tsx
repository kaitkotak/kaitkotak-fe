import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMessageApi } from "../../../../context/message";
import axiosInstance from "../../../../libs/axios";

const useUpdateTransportation = () => {
  const url: string = "/master/transport_vehicle";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updateTransportation"],
    mutationFn: async (paylod: ITransportationForm) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
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

export default useUpdateTransportation;
