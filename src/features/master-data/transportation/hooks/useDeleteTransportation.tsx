import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

interface IProps {
  id: string;
}

const useDeleteTransportation = () => {
  const queryClient = useQueryClient();
  const [messageApi, _] = message.useMessage();

  return useMutation({
    mutationKey: ["deleteTransportation"],
    mutationFn: async (params: IProps) => {
      const url: string = `/master/transport_vehicle/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "test",
      });
      queryClient.invalidateQueries({
        queryKey: ["masterTransportation"],
      });
    },
  });
};

export default useDeleteTransportation;
