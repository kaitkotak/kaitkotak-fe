import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";

interface IProps {
  id: string;
}

const UseGetTransportation = (props: IProps) => {
  const url: string = `/master/transport_vehicle/${props.id}`;
  return useQuery({
    queryKey: ["masterTransportationDetail", props.id],
    queryFn: async () => axiosInstance.get(url),
    staleTime: Infinity,
  });
};

export default UseGetTransportation;
