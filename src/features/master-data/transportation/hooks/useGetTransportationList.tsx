import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../libs/axios";

const UseGetTransportatonList = () => {
  const url: string = `/master/transport_vehicle/all`;
  return useQuery({
    queryKey: ["masterTransportationList"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetTransportatonList;
