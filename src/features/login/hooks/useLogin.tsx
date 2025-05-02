import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../libs/axios";
import useGetUserInfo from "./useGetUserInfo";

const useLogin = () => {
  const url: string = "/auth/login";
  const navigate = useNavigate();
  const { mutateAsync: getUserInfo } = useGetUserInfo();

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (paylod: ILoginPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      getUserInfo();
      navigate("/production");
    },
  });
};

export default useLogin;
