import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

interface IProps {
  id: number;
}

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: async (params: IProps) => {
      const url: string = `/user/${params.id}`;
      return await axiosInstance.delete(url);
    },
    onSuccess: (data) => {
      message.success({
        content: data.data.message,
        duration: 3,
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export default useDeleteUser;
