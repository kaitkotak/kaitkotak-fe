import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

const useCreateUser = () => {
  const url: string = "/user";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (paylod: IUserPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      navigate("/user");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreateUser;
