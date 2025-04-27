import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewCourseCardProps {
  university: string;
  className?: string;
}

export function NewCourseCard({ university, className }: NewCourseCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden border-dashed h-full", 
        className
      )}
    >
      <Link 
        to={`/${university}/create`} 
        className="flex flex-col items-center justify-center h-full p-8 transition-all hover:bg-slate-50"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative rounded-full bg-blue-100 p-4">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-slate-700">Új kurzus létrehozása</h3>
            <p className="text-sm text-slate-500">Kattints a kurzus létrehozásához</p>
          </div>
        </div>
      </Link>
    </Card>
  );
} 