import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../libs/axios";
import { message } from "antd";

const useUpdateSalesPeople = () => {
  const url: string = "/master/sales_people";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSalesPeople"],
    mutationFn: async (paylod: ISalesPeople) => {
      return await axiosInstance.put(`${url}/${paylod.id}`, paylod);
    },
    onSuccess: () => {
      navigate("/master/sales-people");
      queryClient.invalidateQueries({
        queryKey: ["masterSalesPeople"],
      });
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpdateSalesPeople;
