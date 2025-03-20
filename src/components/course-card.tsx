import { Card } from "@/components/ui/card";
import { CourseData } from "@/lib/constants";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical, MessageSquare, FileText, Folder } from "lucide-react";
import { Button } from "./ui/button";

interface CourseCardProps {
  course: CourseData;
  university: string;
}

export function CourseCard({ course, university }: CourseCardProps) {

  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden cursor-pointer" onClick={() => navigate(`/${university}/${course._id}`)}>
      <div className="relative">
        {/* Course color banner */}
        <div className="h-32 bg-purple-500" /> {/* We can make this dynamic based on course type */}
        
        {/* More options button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Course title and date */}
        <div>
          <h3 className="font-semibold text-lg">{course.name}</h3>
          <p className="text-sm text-muted-foreground">2024/25/1</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Link to={`/${university}/${course._id}`}>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/attendance`}>
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={`/${university}/${course._id}/files`}>
            <Button variant="ghost" size="icon">
              <Folder className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}