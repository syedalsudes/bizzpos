'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    check();
  }, [router]);

  return { user, loading };
}
