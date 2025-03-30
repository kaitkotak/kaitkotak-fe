import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../libs/axios";
import { message } from "antd";

const useUpload = () => {
  const url: string = "/file/upload";

  return useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: async (logo: File) => {
      const formData = new FormData();
      formData.append("file", logo);

      return await axiosInstance.post(`${url}`, formData, {
        headers: { "content-type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      message.success({
        content: "hahahah",
        duration: 5,
      });
    },
  });
};

export default useUpload;
