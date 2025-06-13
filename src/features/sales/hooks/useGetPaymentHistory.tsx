import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

interface IProps {
  id: string;
}

const useGetPaymentHistory = (props: IProps) => {
  const url: string = `/payment/detail/${props.id}`;
  return useQuery({
    queryKey: ["paymentHistory", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default useGetPaymentHistory;
