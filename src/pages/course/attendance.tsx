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
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { MoreVertical, Pencil, Trash2, Upload, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface AttendanceRecord {
  date: string;
  status: boolean;
  _id: string;
  attendanceImage: AttendanceImage;
  uploaded: boolean;
  image?: string;
}

interface AttendanceImage {
  _id: string;
  name: string;
  description: string;
}

const Attendance = () => {
  const { courseId } = useParams();
  const token = useAuthStore((state) => state.token);

  const { data: attendances, isLoading: attendancesLoading } = useQuery({
    queryKey: ["attendances", courseId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/attendance/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data as AttendanceRecord[];
    },
    enabled: !!courseId && !!token,
  });

  console.log(attendances);

  if (attendancesLoading) {
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
              <TableHead>Kép</TableHead>
              <TableHead className="text-center">Feltöltés</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances?.map((record) => (
              <TableRow key={record._id}>
                <TableCell className="font-medium">
                  {format(new Date(record.date), "yyyy. MMMM d. HH:mm", {
                    locale: hu,
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.status ? "Feltöltve" : "Nincs feltöltve"}
                  </span>
                </TableCell>
                <TableCell>
                  {record.status && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Megtekintés
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <div className="aspect-[3/2] relative overflow-hidden rounded-lg">
                          <img
                            src={`${API_URL}/attendance/image/${record.attendanceImage._id}`}
                            alt={record.attendanceImage.name}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!record.status && (
                      <Link to={`upload`}>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Feltöltés
                        </Button>
                      </Link>
                    )}
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
