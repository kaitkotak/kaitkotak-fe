import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

interface IProps {
  id: number;
}

const useDeleteProduction = () => {
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["deleteProduction"],
    mutationFn: async (params: IProps) => {
      const url: string = `/production/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: (data) => {
      message.success({
        content: data.data.message,
        duration: 3,
      });
      queryClient.invalidateQueries({
        queryKey: ["productions"],
      });
    },
  });
};

export default useDeleteProduction;
