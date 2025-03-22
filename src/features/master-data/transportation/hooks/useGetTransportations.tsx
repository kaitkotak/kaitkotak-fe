import { useQuery } from "@tanstack/react-query";
import { generateUrlWithParams } from "../../../../libs/generateUrlWithParams";
import { axiosInstance } from "../../../../libs/axios";

const UseGetTransportations = (props: ITableParams) => {
  const url: string = generateUrlWithParams(
    `/master/transport_vehicle?`,
    props
  );
  return useQuery({
    queryKey: ["masterTransportation", props],
    queryFn: async () => axiosInstance.get(url),
    staleTime: Infinity,
  });
};

export default UseGetTransportations;
