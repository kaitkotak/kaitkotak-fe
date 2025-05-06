import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";

interface IProps {
  id: string;
}

const UseGetCustomer = (props: IProps) => {
  const url: string = `/master/customers/${props.id}`;
  return useQuery({
    queryKey: ["masterCustomer", props.id],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetCustomer;
