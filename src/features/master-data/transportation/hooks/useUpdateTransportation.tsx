import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

const useUpdateTransportation = () => {
  const url: string = "/master/transport_vehicle";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTransportation"],
    mutationFn: async (paylod: ITransportationForm) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: () => {
      navigate("/master/transportation");
      queryClient.invalidateQueries({
        queryKey: ["masterTransportation"],
      });
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpdateTransportation;
