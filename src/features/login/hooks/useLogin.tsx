import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";
import useGetUserInfo from "./useGetUserInfo";

const useLogin = () => {
  const url: string = "/auth/login";
  const { mutateAsync: getUserInfo } = useGetUserInfo();

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (paylod: ILoginPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      getUserInfo();
    },
  });
};

export default useLogin;
