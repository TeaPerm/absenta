import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";
import { Container } from "@/components/ui/container";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AttendanceStatusSelect,
  AttendanceStatus,
} from "@/components/attendance-status-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface AttendanceRecord {
  date: string;
  status: boolean;
  _id: string;
  attendanceImage: {
    _id: string;
    name: string;
    description: string;
  };
  uploaded: boolean;
  updatedAt: string;
  image?: string;
  students?: Array<{
    student_name: string;
    neptun_code: string;
    status: AttendanceStatus;
  }>;
}

const AttendanceView = () => {
  const navigate = useNavigate();
  const { attendanceId } = useParams();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [localStudents, setLocalStudents] =
    useState<AttendanceRecord["students"]>();

  const { data: record, isLoading } = useQuery<AttendanceRecord>({
    queryKey: ["attendance", attendanceId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/attendance/${attendanceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!attendanceId && !!token,
  });

  useEffect(() => {
    if (record?.students) {
      setLocalStudents(record.students);
    }
  }, [record]);

  const updateMutation = useMutation({
    mutationFn: async (students: AttendanceRecord["students"]) => {
      const response = await axios.put(
        `${API_URL}/attendance/${attendanceId}`,
        { students },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", attendanceId] });
      navigate(-1);
      toast.success("Jelenléti ív sikeresen frissítve");
    },
    onError: () => {
      toast.error("Hiba történt a jelenléti ív frissítésekor");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!record) {
    return <div>Record not found</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (localStudents) {
      updateMutation.mutate(localStudents);
    }
  };

  const handleStatusChange = (
    studentName: string,
    newStatus: AttendanceStatus
  ) => {
    if (!localStudents) return;

    setLocalStudents((prev) =>
      prev?.map((student) =>
        student.student_name === studentName
          ? { ...student, status: newStatus }
          : student
      )
    );
  };

  return (
    <Container className="py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold">
          Jelenléti ív -{" "}
          {format(new Date(record.date), "yyyy. MMMM d. HH:mm", {
            locale: hu,
          })}
        </h1>

        {record.attendanceImage && (
          <div className="relative w-full h-[40vh] overflow-hidden rounded-lg border">
            <img
              src={`${API_URL}/attendance/image/${record.attendanceImage._id}`}
              alt={record.attendanceImage.name}
              className="object-contain w-full h-full"
            />
          </div>
        )}

        {localStudents && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hallgató neve</TableHead>
                <TableHead>Neptunkód</TableHead>
                <TableHead>Jelenlét</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.neptun_code}</TableCell>
                  <TableCell>
                    <AttendanceStatusSelect
                      value={student.status}
                      onChange={(value) =>
                        handleStatusChange(student.student_name, value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="w-[100px] bg-red-500 hover:bg-red-600"
          >
            Mégse
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-[200px]"
          >
            {updateMutation.isPending ? "Mentés..." : "Mentés"}
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default AttendanceView;
