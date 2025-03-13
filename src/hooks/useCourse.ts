import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL, CourseData } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";

export function useCourse(courseId: string | undefined) {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            return data as CourseData;
        },
        enabled: !!courseId,
    });
}