import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { axiosInstance } from "../../../libs/axios";

const useUpdateSales = () => {
  const url: string = "/invoice";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSales"],
    mutationFn: async (paylod: ISalesForm) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: () => {
      navigate("/sales");
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpdateSales;
