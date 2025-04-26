import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { axiosInstance } from "../../../libs/axios";

const useDownloadSalesReport = () => {
  return useMutation({
    mutationKey: ["downloadTravelDocument"],
    mutationFn: async (id: number) => {
      const url: string = `/invoice/download/rekap-penjualan/${id}`;
      return await axiosInstance.get(url);
    },
    onSuccess: () => {
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useDownloadSalesReport;
