import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../libs/axios";
import { useMessageApi } from "../../../../context/message";

const useCreateItem = () => {
  const url: string = "/master/items";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createItem"],
    mutationFn: async (paylod: IItemnForm) => {
      return await axiosInstance.post(url, paylod);
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

export default useCreateItem;
