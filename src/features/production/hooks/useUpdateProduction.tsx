import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

interface IProps {
  id: string;
  payload: IProductionPayload;
}

const useUpdateProduction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updateProduction"],
    mutationFn: async (props: IProps) => {
      const url: string = `/production/${props.id}`;
      return await axiosInstance.put(url, props.payload);
    },
    onSuccess: (data) => {
      navigate("/production");
      queryClient.invalidateQueries({
        queryKey: ["productions"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useUpdateProduction;
