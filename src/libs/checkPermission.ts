import { useUser } from "../context/user";

export const checkPermission = (requiredPermission: string) => {
  const { userInfo } = useUser();

  if (!userInfo) return false;
  const hasPermission = userInfo.permissions.includes(requiredPermission);

  return hasPermission;
};
