import { Navigate } from "react-router-dom";
import { useUser } from "../context/user";
import { Spin } from "antd";

interface IProtectedRouteProps {
  requiredPermission: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({
  requiredPermission,
  children,
}: IProtectedRouteProps) => {
  const { userInfo, loading } = useUser();

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!userInfo) return <Navigate to="/login" replace />;

  const hasPermission = userInfo.permissions.includes(requiredPermission);

  return hasPermission ? <>{children}</> : <Navigate to="/403" replace />;
};

export default ProtectedRoute;
