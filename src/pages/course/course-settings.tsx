import { Container } from "@/components/ui/container";
import { useParams } from "react-router-dom";
import { CourseForm } from "@/components/course-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/hooks/useAuth";
import { API_URL } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseSettings() {
  const { courseId, university } = useParams();
  const token = useAuthStore((state) => state.token);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Container className="py-2 sm:py-4 md:py-6 h-full">
        <div className="space-y-3 sm:space-y-4 md:space-y-6 h-full flex flex-col">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-2 sm:py-4 md:py-6 h-full">
      <div className="space-y-3 sm:space-y-4 md:space-y-6 h-full flex flex-col">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Kurzus beállítások</h1>
          <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Kurzus adatainak szerkesztése.
          </p>
        </div>

        <CourseForm 
          initialData={course}
          courseId={courseId}
          university={university!}
          mode="edit"
        />
      </div>
    </Container>
  );
}
