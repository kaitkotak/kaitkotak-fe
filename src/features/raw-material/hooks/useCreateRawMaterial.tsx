import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../libs/axios";

const useCreateRawMaterial = () => {
  const url: string = "/material";
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createRawMaterial"],
    mutationFn: async (paylod: IRawMaterialPayload) => {
      return await axiosInstance.post(url, paylod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rawMaterials"],
      });
    },
  });
};

export default useCreateRawMaterial;
