import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

interface IProps {
  id: string;
  payload: ISalesFormPayload;
}

const useUpdateSales = () => {
  const url: string = "/invoice";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updateSales"],
    mutationFn: async ({ id, payload }: IProps) => {
      return await axiosInstance.put(`${url}/${id}`, payload);
    },
    onSuccess: (data) => {
      navigate("/sales");
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useUpdateSales;
