import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";

const useCreateUser = () => {
  const url: string = "/user";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (paylod: IUserPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      navigate("/user");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export default useCreateUser;
