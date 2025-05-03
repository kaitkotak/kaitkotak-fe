import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";

interface IProps {
  id: string;
}

const useGetSalesDetail = (props: IProps) => {
  const url: string = `/invoice/${props.id}`;
  return useQuery({
    queryKey: ["salesDetail", props],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default useGetSalesDetail;
