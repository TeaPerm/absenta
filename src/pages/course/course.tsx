import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL, CourseData } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";

const Course = () => {
  const { courseId } = useParams();
  const token = useAuthStore((state) => state.token);
  
  const { 
    data: course,
    isLoading,
    isError,
    error
  } = useQuery({
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

  if (isLoading) {
    return <div>Loading course...</div>;
  }

  if (isError) {
    return <div>Error loading course: {(error as Error).message}</div>;
  }

  return (
    <div>
      {JSON.stringify(course)}
    </div>
  );
};

export default Course;