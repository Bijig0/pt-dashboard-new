import { Navigate, Outlet } from "react-router";
import useIsSignedIn from "./hooks/useIsSignedIn";
import LoadingScreen from "./pages/admin/LoadingScreen";

type Props = {
  redirectPath?: string;
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = (props: Props) => {
  const { redirectPath = "/authentication/sign-in/", children } = props;
  const { data: isSignedIn, isLoading } = useIsSignedIn();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
