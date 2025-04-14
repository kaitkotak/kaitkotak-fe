import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";

interface IProps {
  id: string;
  payload: IProductionPayload;
}

const useUpdateProduction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProduction"],
    mutationFn: async (props: IProps) => {
      const url: string = `/production/${props.id}`;
      return await axiosInstance.put(url, props.payload);
    },
    onSuccess: () => {
      navigate("/production");
      queryClient.invalidateQueries({
        queryKey: ["productions"],
      });
    },
  });
};

export default useUpdateProduction;
