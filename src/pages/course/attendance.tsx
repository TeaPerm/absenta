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
import {
  MoreVertical,
  Trash2,
  Eye,
  FolderInput,
  Printer,
  ArrowUpDown,
  Pencil,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { useCourse } from "@/hooks/useCourse";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { PrintableAttendance } from "@/components/printable-attendance";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

type SortField = "date" | "updatedAt";
type SortDirection = "asc" | "desc";

const Attendance = () => {
  const { courseId } = useParams();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null
  );
  const course = useCourse(courseId);
  const courseName = course.data?.name;
  const students = course.data?.students || [];
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedPrintDate, setSelectedPrintDate] = useState<Date>(new Date());
  const [selectedPrintStartTime, setSelectedPrintStartTime] = useState<{
    hours: string;
    minutes: string;
  }>({ hours: "", minutes: "" });
  const [selectedPrintEndTime, setSelectedPrintEndTime] = useState<{
    hours: string;
    minutes: string;
  }>({ hours: "", minutes: "" });
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Add sorting state
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const handleDelete = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleExport = (record: AttendanceRecord) => {
    if (!record.students || !courseName) return;

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      record.students.map((student) => ({
        "Hallgató neve": student.student_name,
        Neptunkód: student.neptun_code,
        Jelenlét: student.status,
      }))
    );

    // Set column widths
    const colWidths = [
      { wch: 30 }, // Név
      { wch: 15 }, // Neptun kód
      { wch: 15 }, // Jelenlét
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Jelenléti ív");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = createExportName(courseName, new Date(record.date));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setPrintDialogOpen(true);
  };

  const handlePrintConfirm = () => {
    const printDate = new Date(selectedPrintDate);
    if (selectedPrintStartTime.hours && selectedPrintStartTime.minutes) {
      printDate.setHours(parseInt(selectedPrintStartTime.hours));
      printDate.setMinutes(parseInt(selectedPrintStartTime.minutes));
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Jelenléti ív nyomtatása</title>
            <style>
              @media print {
                body { margin: 0; }
                table { 
                  width: 100%;
                  border-collapse: collapse;
                  border: 2px solid black;
                }
                th, td {
                  border: 2px solid black;
                  padding: 0.5em;
                }
                th {
                  text-align: left;
                  background-color: white;
                }
                .border-r-2 {
                  border-right: 2px solid black;
                }
                .border-l-2 {
                  border-left: 2px solid black;
                }
                .border-b-2 {
                  border-bottom: 2px solid black;
                }
                .w-\\[10\\%\\] {
                  width: 10%;
                }
                .w-\\[20\\%\\] {
                  width: 20%;
                }
                .w-\\[40\\%\\] {
                  width: 40%;
                }
                .text-center {
                  text-align: center;
                }
                .text-left {
                  text-align: left;
                }
                .py-3 {
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem;
                }
                .px-4 {
                  padding-left: 1rem;
                  padding-right: 1rem;
                }
              }
            </style>
          </head>
          <body>
            ${document.getElementById("printable-attendance")?.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
    setPrintDialogOpen(false);
  };

  // Sort function to sort attendance records
  const sortAttendances = (records: AttendanceRecord[] | undefined) => {
    if (!records) return [];

    return [...records].sort((a, b) => {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();

      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Toggle sort handler
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Get sorted attendance records
  const sortedAttendances = sortAttendances(attendances);

  if (attendancesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-4 sm:py-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold">Jelenléti ív</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Sablon nyomtatása
            </Button>
            <Link to="upload" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <FolderInput className="mr-2 h-4 w-4" />
                Új jelenléti ív
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[600px] px-4 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("date")}
                      className="flex items-center gap-1 h-8 -ml-4"
                    >
                      Dátum
                      <ArrowUpDown
                        className={cn(
                          "h-4 w-4 transition-all",
                          sortField === "date" &&
                            sortDirection === "asc" &&
                            "rotate-180",
                          sortField !== "date" && "opacity-50"
                        )}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">Státusz</TableHead>
                  <TableHead className="text-center">Kép</TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("updatedAt")}
                      className="flex items-center gap-1 h-8 -ml-4"
                    >
                      Feltöltés dátuma
                      <ArrowUpDown
                        className={cn(
                          "h-4 w-4 transition-all",
                          sortField === "updatedAt" &&
                            sortDirection === "asc" &&
                            "rotate-180",
                          sortField !== "updatedAt" && "opacity-50"
                        )}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">Műveletek</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAttendances?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-bold">
                      Nincs még jelenléti ív
                    </TableCell>
                  </TableRow>
                )}
                {sortedAttendances?.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell className="font-medium">
                      <span className="hidden sm:inline">
                        {format(new Date(record.date), "yyyy. MMMM d.", {
                          locale: hu,
                        })}
                      </span>
                      <span className="sm:hidden">
                        {format(new Date(record.date), "yyyy. MMMM d.", {
                          locale: hu,
                        })}
                      </span>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">
                                Megtekintés
                              </span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl">
                            <DialogTitle>
                              {format(new Date(record.date), "yyyy. MMMM d.", {
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
                    <TableCell className="text-center">
                      <span className="hidden sm:inline">
                        {format(
                          new Date(record.updatedAt),
                          "yyyy. MMMM d. HH:mm",
                          {
                            locale: hu,
                          }
                        )}
                      </span>
                      <span className="sm:hidden">
                        {format(new Date(record.updatedAt), "yyyy. MMMM d.", {
                          locale: hu,
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
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
                            <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                              <Link
                                to={`${record._id}`}
                                className="flex items-center w-full"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Szerkesztés</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onSelect={() => handleDelete(record)}
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
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Jelenléti ív törlése"
        description="Biztosan törölni szeretnéd ezt a jelenléti ívet? Ez a művelet nem visszafordítható."
        onConfirm={() =>
          selectedRecord && deleteMutation.mutate(selectedRecord._id)
        }
        confirmText="Törlés"
        cancelText="Mégse"
      />

      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent>
          <DialogTitle>Jelenléti ív nyomtatása</DialogTitle>
          <div className="flex flex-col items-center gap-4 py-4">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedPrintDate ? (
                    format(selectedPrintDate, "yyyy. MMMM d.", { locale: hu })
                  ) : (
                    <span>Válassz dátumot</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 flex" align="start">
                <Calendar
                  mode="single"
                  selected={selectedPrintDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedPrintDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex flex-col justify-center gap-4 w-full items-center">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Kezdési időpont</span>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      placeholder="Óra"
                      className="w-20"
                      value={selectedPrintStartTime.hours}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (parseInt(value) >= 0 && parseInt(value) <= 23)
                        ) {
                          setSelectedPrintStartTime((prev) => ({
                            ...prev,
                            hours: value,
                          }));
                        }
                      }}
                    />
                    <span>:</span>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Perc"
                      className="w-20"
                      value={selectedPrintStartTime.minutes}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (parseInt(value) >= 0 && parseInt(value) <= 59)
                        ) {
                          setSelectedPrintStartTime((prev) => ({
                            ...prev,
                            minutes: value,
                          }));
                        }
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (opcionális)
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Befejezési időpont</span>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      placeholder="Óra"
                      className="w-20"
                      value={selectedPrintEndTime.hours}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (parseInt(value) >= 0 && parseInt(value) <= 23)
                        ) {
                          setSelectedPrintEndTime((prev) => ({
                            ...prev,
                            hours: value,
                          }));
                        }
                      }}
                    />
                    <span>:</span>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Perc"
                      className="w-20"
                      value={selectedPrintEndTime.minutes}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (parseInt(value) >= 0 && parseInt(value) <= 59)
                        ) {
                          setSelectedPrintEndTime((prev) => ({
                            ...prev,
                            minutes: value,
                          }));
                        }
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (opcionális)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={handlePrintConfirm} className="w-full sm:w-auto">
                Nyomtatás
              </Button>
              <Button
                variant="outline"
                onClick={() => setPrintDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Mégse
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden printable component */}
      <div id="printable-attendance" className="hidden">
        <PrintableAttendance
          students={students}
          courseName={courseName || ""}
          date={selectedPrintDate}
          startTime={
            selectedPrintStartTime.hours && selectedPrintStartTime.minutes
              ? `${selectedPrintStartTime.hours.padStart(
                  2,
                  "0"
                )}:${selectedPrintStartTime.minutes.padStart(2, "0")}`
              : undefined
          }
          endTime={
            selectedPrintEndTime.hours && selectedPrintEndTime.minutes
              ? `${selectedPrintEndTime.hours.padStart(
                  2,
                  "0"
                )}:${selectedPrintEndTime.minutes.padStart(2, "0")}`
              : undefined
          }
        />
      </div>
    </Container>
  );
};

export default Attendance;
