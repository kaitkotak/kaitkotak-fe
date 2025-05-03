import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";
import { useNavigate } from "react-router-dom";

const useGetRefreshToken = () => {
  const url: string = "/auth/refresh_token";
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["userRefreshToken"],
    mutationFn: async () => {
      return await axiosInstance.get(url);
    },
    onError: () => {
      navigate("/login");
    },
  });
};

export default useGetRefreshToken;
