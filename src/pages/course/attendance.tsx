import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/useCourse";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { MoreVertical, Pencil, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttendanceRecord {
  date: string;
  uploaded: boolean;
}

const Attendance = () => {
  const { courseId } = useParams();
  const { data: course, isLoading } = useCourse(courseId);

  // Generate attendance records for the last 30 days
  const attendanceRecords: AttendanceRecord[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      uploaded: false, // This should come from your API
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jelenléti lista</h1>
        </div>

        <Table className="md:min-w-[600px]">
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>Dátum</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead className="text-center">Feltöltés</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => (
              <TableRow key={record.date}>
                <TableCell className="font-medium">
                  {format(new Date(record.date), "yyyy. MMMM d. HH:mm", { locale: hu })}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.uploaded 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {record.uploaded ? "Feltöltve" : "Nincs feltöltve"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`upload`}>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Feltöltés
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="ml-4" asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Szerkesztés</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Törlés</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default Attendance;
