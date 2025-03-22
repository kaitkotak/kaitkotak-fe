import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";

interface IProps {
  id: string;
}

const UseGetDetailSalesPeople = (props: IProps) => {
  const url: string = `/master/sales_people/${props.id}`;
  return useQuery({
    queryKey: ["masterSalesPeopleDetail", props.id],
    queryFn: async () => axiosInstance.get(url),
    staleTime: Infinity,
  });
};

export default UseGetDetailSalesPeople;
