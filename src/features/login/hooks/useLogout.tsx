import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const url: string = "/auth/logout";
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return await axiosInstance.get(url);
    },
    onSuccess: () => {
      localStorage.clear()
      navigate("/");
    },
  });
};

export default useLogout;
