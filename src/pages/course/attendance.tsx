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
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { MoreVertical, Trash2, Upload, Eye, FolderInput } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { createExportName } from "@/lib/utils";
import { useAuthStore } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import { useCourse } from "@/hooks/useCourse";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface AttendanceRecord {
  date: string;
  status: boolean;
  _id: string;
  attendanceImage: AttendanceImage;
  uploaded: boolean;
  updatedAt: string;
  image?: string;
  students?: Array<{
    student_name: string;
    neptun_code: string;
    status: string;
  }>;
}

interface AttendanceImage {
  _id: string;
  name: string;
  description: string;
}

const Attendance = () => {
  const { courseId } = useParams();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const course = useCourse(courseId);
  const courseName = course.data?.name;

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

  const deleteMutation = useMutation({
    mutationFn: async (attendanceId: string) => {
      const response = await axios.delete(
        `${API_URL}/attendance/${attendanceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances", courseId] });
      toast.success("Jelenléti ív sikeresen törölve");
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    },
    onError: () => {
      toast.error("Hiba történt a jelenléti ív törlésekor");
    },
  });

  const handleDeleteClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleExport = (record: AttendanceRecord) => {
    if (!record.students || !courseName) return;

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      record.students.map(student => ({
        'Hallgató neve': student.student_name,
        'Neptunkód': student.neptun_code,
        'Jelenlét': student.status
      }))
    );

    // Set column widths
    const colWidths = [
      { wch: 30 }, // Név
      { wch: 15 }, // Neptun kód
      { wch: 15 }, // Jelenlét
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Jelenléti ív');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = createExportName(courseName, new Date(record.date));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (attendancesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jelenléti ív</h1>
          <Link to="upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Új jelenléti ív
            </Button>
          </Link>
        </div>

        <Table className="md:min-w-[600px]">
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="text-center">Dátum</TableHead>
              <TableHead className="text-center">Státusz</TableHead>
              <TableHead className="text-center">Kép</TableHead>
              <TableHead className="text-center">Jelenlét</TableHead>
              <TableHead className="text-center">Feltöltés dátuma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-bold">
                  Nincs még jelenléti ív
                </TableCell>
              </TableRow>
            )}
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
                          <Eye className="h-4 w-4" />
                          Megtekintés
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl">
                        <DialogTitle>
                          {format(new Date(record.date), "yyyy. MMMM d. HH:mm", {
                            locale: hu,
                          })}
                        </DialogTitle>
                        <div className="relative w-full h-[80vh] overflow-hidden rounded-lg border">
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
                    <Link to={`${record._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        Megtekintés
                      </Button>
                    </Link>
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(record.updatedAt), "yyyy. MMMM d. HH:mm", {
                    locale: hu,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="ml-4" asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleExport(record)}
                        >
                          <FolderInput className="mr-2 h-4 w-4" />
                          <span>Exportálás</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDeleteClick(record)}
                        >
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Jelenléti ív törlése"
        description="Biztosan törölni szeretnéd ezt a jelenléti ívet? Ez a művelet nem visszafordítható."
        onConfirm={() => selectedRecord && deleteMutation.mutate(selectedRecord._id)}
        confirmText="Törlés"
        cancelText="Mégse"
      />
    </Container>
  );
};

export default Attendance;
