import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

const useUpdateItem = () => {
  const url: string = "/master/items";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateItem"],
    mutationFn: async (paylod: IItemnForm) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: () => {
      navigate("/master/item");
      queryClient.invalidateQueries({
        queryKey: ["masterItems"],
      });
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpdateItem;
