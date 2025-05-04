import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";
import { useUser } from "../../../context/user";
import { useNavigate } from "react-router-dom";

const useGetUserInfo = () => {
  const url: string = "/auth/me";
  const { setUserInfo } = useUser();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["userInfo"],
    mutationFn: async () => {
      return await axiosInstance.get(url);
    },
    onSuccess: (data) => {
      localStorage.setItem("userInfo", JSON.stringify(data.data.data));
      setUserInfo(data.data.data);
      navigate("/production");
    },
  });
};

export default useGetUserInfo;
