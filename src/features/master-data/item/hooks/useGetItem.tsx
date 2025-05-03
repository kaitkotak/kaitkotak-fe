import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../../libs/axios";

interface IProps {
  id: string;
}

const UseGetItem = (props: IProps) => {
  const url: string = `/master/items/${props.id}`;
  return useQuery({
    queryKey: ["masterItem", props.id],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetItem;
