import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const location = useLocation();
  if (!isAdmin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

export default RequireAdmin;