import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";

const UseGetProductionPlan = () => {
  const url: string = `/production/deficit-items`;
  return useQuery({
    queryKey: ["productionPlan"],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetProductionPlan;
