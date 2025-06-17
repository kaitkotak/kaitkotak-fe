import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

const UseGetAllPaymentInvoices = () => {
  return useMutation({
    mutationKey: ["getPaymentInvoices"],
    mutationFn: async (id: string) => {
      const url: string = `/invoice/payments?customer_id=${id}&all=true`;
      return await axiosInstance.get(url);
    },
  });
};

export default UseGetAllPaymentInvoices;
