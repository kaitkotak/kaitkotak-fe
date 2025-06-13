import { useQuery } from "@tanstack/react-query";
import { generateUrlWithParams } from "../../../libs/generateUrlWithParams";
import axiosInstance from "../../../libs/axios";

const UseGetPaymentHistories = (props: ICustomTablePaginationConfig) => {
  const url: string = generateUrlWithParams(`/payment?`, props);
  return useQuery({
    queryKey: ["paymentHistories", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetPaymentHistories;
