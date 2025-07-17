import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

interface IProps {
  id: string;
}

const UseGetPurchaseOrder = (props: IProps) => {
  const url: string = `/purchase_order/${props.id}`;
  return useQuery({
    queryKey: ["purchaseOrder", props.id],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetPurchaseOrder;
