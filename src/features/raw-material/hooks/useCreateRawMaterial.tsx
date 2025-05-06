import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../libs/axios";
import { useMessageApi } from "../../../context/message";

const useCreateRawMaterial = () => {
  const url: string = "/material";
  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["createRawMaterial"],
    mutationFn: async (paylod: IRawMaterialPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["rawMaterials"],
      });
      message.success({
        content: data.data.message,
        duration: 3,
      });
    },
  });
};

export default useCreateRawMaterial;
