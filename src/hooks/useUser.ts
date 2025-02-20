import { API_URL, User } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./useAuth";

export const useUser = (): User | null => {
    const token = useAuthStore((state) => state.token);
    const signOut = useAuthStore((state) => state.signOut);

    const { data } = useQuery<User | null>({
        queryKey: ["user"],
        queryFn: async () => {
            if (!token) {
                return null;
            }

            try {
                const response = await fetch(API_URL + "/auth/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        signOut();
                    }
                    throw new Error("Failed to fetch user");
                }

                const user = await response.json();
                return user || null;
            } catch (error) {
                console.error("Error fetching user:", error);
                signOut();
                return null;
            }
        },
        enabled: !!token,
    });

    return data ?? null;
};