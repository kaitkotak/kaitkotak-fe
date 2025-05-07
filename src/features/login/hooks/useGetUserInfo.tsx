import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";
import { useUser } from "../../../context/user";

const useGetUserInfo = () => {
  const url: string = "/auth/me";
  const { setUserInfo } = useUser();

  return useMutation({
    mutationKey: ["userInfo"],
    mutationFn: async () => {
      return await axiosInstance.get(url);
    },
    onSuccess: (data) => {
      localStorage.setItem("userInfo", JSON.stringify(data.data.data));
      setUserInfo(data.data.data);
    },
  });
};

export default useGetUserInfo;
