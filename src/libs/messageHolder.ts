// utils/messageBridge.ts
import type { MessageInstance } from "antd/es/message/interface";

let messageApi: MessageInstance | null = null;

export const setMessageApi = (instance: MessageInstance) => {
  messageApi = instance;
};

export const getMessageApi = (): MessageInstance | null => {
  return messageApi;
};
