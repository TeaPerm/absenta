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

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{course.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{course.university}</span>
          <span>•</span>
          <span>{course.dayOfWeek}</span>
          <span>•</span>
          <span>
            {course.startTime} - {course.endTime}
          </span>
        </div>
      </div>

      {/* Students List */}
      <div className="border rounded-lg">
        <div className="grid grid-cols-2 gap-4 p-4 border-b bg-muted">
          <div className="font-medium">Neptun kód</div>
          <div className="font-medium">Név</div>
        </div>
        <div className="divide-y">
          {course.students.map((student) => (
            <div
              key={student.neptun_code}
              className="grid grid-cols-2 gap-4 p-4 hover:bg-muted/50"
            >
              <div>{student.name}</div>
              <div className="font-mono">{student.neptun_code}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Összes tanuló: {course.students.length}
      </div>
    </div>
  );
};

export default Course;
