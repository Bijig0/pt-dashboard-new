import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { error } from "console";
import { supabase } from "../supabase";

const useUser = () => {
  const getUser = async (): Promise<User | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  };

  const result = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return result;
};

export default useUser;
