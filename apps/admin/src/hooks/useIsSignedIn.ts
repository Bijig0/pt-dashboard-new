import { AuthError, Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import setToken from "../helpers/auth/setToken";
import { supabase } from "../supabase";

type IsSignedIn = {
  session: Session | null;
  error: AuthError | null;
};

const useIsSignedIn = () => {
  const getIsSignedIn = async (): Promise<boolean> => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const isSignedIn: boolean = session !== null && error === null;

    if (!isSignedIn) {
      return false;
    }

    if (session === null) return false;

    setToken("refreshToken", session?.refresh_token);
    setToken("accessToken", session?.access_token);

    return true;
  };

  const result = useQuery({
    queryKey: ["isSignedIn"],
    queryFn: getIsSignedIn,
    gcTime: 0,
  });

  return result;
};

export default useIsSignedIn;
