import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";

const useGetUserInfo = () => {
  const url: string = "/auth/me";

  return useMutation({
    mutationKey: ["userInfo"],
    mutationFn: async () => {
      return await axiosInstance.get(url);
    },
    onSuccess: (data) => {
      localStorage.setItem("userInfo", data.data.data);
    },
  });
};

export default useGetUserInfo;
