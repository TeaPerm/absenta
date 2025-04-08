import { Card } from "@/components/ui/card";
import { CourseData } from "@/lib/constants";
import { Link, useNavigate } from "react-router-dom";
import { TableOfContents, Users, NotebookText, Settings } from "lucide-react";
import { Button } from "./ui/button";

interface CourseCardProps {
  course: CourseData;
  university: string;
}

export function CourseCard({ course, university }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Course color banner */}
        <div className="h-32 bg-purple-500" />
      </div>

      <div className="p-4 space-y-4">
        {/* Course title and date */}
        <div 
          onClick={() => navigate(`/${university}/${course._id}`)}
          className="cursor-pointer hover:text-blue-600 transition-colors"
        >
          <h3 className="font-semibold text-lg">{course.name}</h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
          <Link to={`/${university}/${course._id}`}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <TableOfContents className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/students`}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <Users className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/attendance`}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <NotebookText className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/settings`}>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}