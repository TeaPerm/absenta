import { useCourses } from "@/hooks/useCourses";
import { useAuthStore } from "@/hooks/useAuth";
import { useAppStore } from "@/hooks/useAppStore";
import { useParams } from "react-router-dom";
import { CourseCard } from "@/components/course-card";
import { Container } from "@/components/ui/container";
import { useEffect } from "react";
import { NewCourseCard } from "@/components/new-course-card";

export function Dashboard() {
  const token = useAuthStore((state) => state.token);
  const { university } = useParams();
  const { data: courses, isLoading } = useCourses(university!, token);
  const setActiveCourseId = useAppStore((state) => state.setActiveCourseId);

  useEffect(() => {
    setActiveCourseId(null);
  }, []);

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Vezérlőpult</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              university={university!}
            />
          ))}
          <NewCourseCard university={university!} />
        </div>
      )}
    </Container>
  );
}