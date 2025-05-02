import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { axiosInstance } from "../../../libs/axios";

const useUpdateUser = () => {
  const url: string = "/user";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (paylod: IUserPayload) => {
      const id: string = paylod.id!;
      delete paylod.id;
      return await axiosInstance.put(`${url}/${id}`, paylod);
    },
    onSuccess: () => {
      navigate("/user");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpdateUser;
