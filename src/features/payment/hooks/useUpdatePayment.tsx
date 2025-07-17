import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

interface IProps {
  id: string;
  payload: IPaymentFormPayload;
}

const useUpdatePayment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["updatePayment"],
    mutationFn: async (props: IProps) => {
      const url: string = `/payment/${props.id}`;
      return await axiosInstance.put(url, props.payload);
    },
    onSuccess: (data) => {
      navigate("/payment");
      queryClient.invalidateQueries({
        queryKey: ["paymentHistories"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useUpdatePayment;
