import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

const UseGetPaymentInvoices = () => {
  return useMutation({
    mutationKey: ["getPaymentInvoices"],
    mutationFn: async (id: string) => {
      const url: string = `/invoice/payments?customer_id=${id}`;
      return await axiosInstance.get(url);
    },
  });
};

export default UseGetPaymentInvoices;
