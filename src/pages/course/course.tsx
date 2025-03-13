import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/useCourse";

const Course = () => {
  const { courseId } = useParams();
  const { data: course, isLoading, isError, error } = useCourse(courseId);

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