import { useUser } from "../context/user";

export const useCheckPermission = () => {
  const { userInfo } = useUser();

  return (requiredPermission: string) => {
    if (!userInfo) return false;
    return userInfo.permissions.includes(requiredPermission);
  };
};
