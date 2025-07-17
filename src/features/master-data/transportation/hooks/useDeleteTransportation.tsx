import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

interface IProps {
  id: string;
}

const useDeleteTransportation = () => {
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["deleteTransportation"],
    mutationFn: async (params: IProps) => {
      const url: string = `/master/transport_vehicle/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: (data) => {
      message.success({
        content: data.data.message,
        duration: 3,
      });
      queryClient.invalidateQueries({
        queryKey: ["masterTransportation"],
      });
    },
  });
};

export default useDeleteTransportation;
