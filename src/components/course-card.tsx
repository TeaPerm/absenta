import { Card } from "@/components/ui/card";
import { CourseData } from "@/lib/constants";
import { Link, useNavigate } from "react-router-dom";
import { TableOfContents, Users, NotebookText, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useAppStore } from "@/hooks/useAppStore";

interface CourseCardProps {
  course: CourseData;
  university: string;
}

export function CourseCard({ course, university }: CourseCardProps) {
  const navigate = useNavigate();
  const setActiveCourseId = useAppStore((state) => state.setActiveCourseId);

  const handleCourseClick = () => {
    setActiveCourseId(course._id);
    navigate(`/${university}/${course._id}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Course color banner */}
        <div className="h-32 bg-purple-500" />
      </div>

      <div className="p-4 space-y-4">
        {/* Course title and date */}
        <div 
          onClick={handleCourseClick}
          className="cursor-pointer hover:text-blue-600 transition-colors"
        >
          <h3 className="font-semibold text-lg">{course.name}</h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
          <Link to={`/${university}/${course._id}`} onClick={() => setActiveCourseId(course._id)}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <TableOfContents className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/students`} onClick={() => setActiveCourseId(course._id)}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <Users className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/attendance`} onClick={() => setActiveCourseId(course._id)}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <NotebookText className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/settings`} onClick={() => setActiveCourseId(course._id)}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}