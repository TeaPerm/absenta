import { useQuery } from "@tanstack/react-query";
import { API_URL, CourseData } from "@/lib/constants";


export function useCourses(selectedUniversity: string, token: string | null) {
  return useQuery<CourseData[]>({
    queryKey: ["courses", selectedUniversity],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/auth/user/courses/${selectedUniversity}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      return response.json();
    },
    enabled: !!selectedUniversity && !!token,
  });
}