import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";

interface IProps {
  id: string;
}

const UseGetUser = (props: IProps) => {
  const url: string = `/user/${props.id}`;
  return useQuery({
    queryKey: ["user", props.id],
    queryFn: async () => axiosInstance.get(url),
  });
};

export default UseGetUser;
