import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

const useUpdateUser = () => {
  const url: string = "/user";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (paylod: IUserPayload) => {
      const id: string = paylod.id!;
      delete paylod.id;
      return await axiosInstance.put(`${url}/${id}`, paylod);
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

export default useUpdateUser;
