import { useState, useEffect } from "react";

import { paths } from "src/routes/paths";
import { useRouter, usePathname } from "src/routes/hooks";

import { SplashScreen } from "src/components/loading-screen";

import { useAppSelector } from "src/redux/hooks";
import { selectAuthState } from "src/redux/selectors";

import { axiosInstance } from "src/lib";

// ----------------------------------------------------------------------

export function AuthGuard({ children }) {
  const router = useRouter();

  const pathname = usePathname();

  const { isLogin, token } = useAppSelector(selectAuthState);
  console.log("this is bearer token auth guard", token);

  const [isChecking, setIsChecking] = useState(true);

  const createRedirectPath = (currentPath) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  const setOrganizationToken = () => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const checkPermissions = async () => {
    if (!isLogin) {
      const redirectPath = createRedirectPath(paths.auth.signIn);

      router.replace(redirectPath);

      return;
    }

    setOrganizationToken();

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, token]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
