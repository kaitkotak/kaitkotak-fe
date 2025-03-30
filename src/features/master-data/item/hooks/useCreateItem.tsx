import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";

const useCreateItem = () => {
  const url: string = "/master/item";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createItem"],
    mutationFn: async (paylod: IItemnForm) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      navigate("/master/items");
      queryClient.invalidateQueries({
        queryKey: ["masterItems"],
      });
    },
  });
};

export default useCreateItem;
