import { Container } from "@/components/ui/container";
import { useParams } from "react-router-dom";
import { CourseForm } from "@/components/course-form";

export function CourseCreate() {
  const { university } = useParams();

  return (
    <Container className="py-2 sm:py-4 md:py-6 h-full">
      <div className="space-y-3 sm:space-y-4 md:space-y-6 h-full flex flex-col">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Új kurzus létrehozása</h1>
          <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Add meg az új kurzus adatait.
          </p>
        </div>

        <CourseForm 
          university={university!} 
          mode="create" 
        />
      </div>
    </Container>
  );
}