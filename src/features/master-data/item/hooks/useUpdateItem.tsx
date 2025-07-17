import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

const useUpdateItem = () => {
  const url: string = "/master/items";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updateItem"],
    mutationFn: async (paylod: IItemnForm) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: (data) => {
      navigate("/master/item");
      queryClient.invalidateQueries({
        queryKey: ["masterItems"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useUpdateItem;
