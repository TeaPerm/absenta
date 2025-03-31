import React, { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table'
import { Button } from './ui/button'
import { API_URL, AttendanceData } from '@/lib/constants'
import { base64ToFile } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { AttendanceStatusSelect, AttendanceStatus } from './attendance-status-select'

interface AttendanceTableProps {
  attendanceData: AttendanceData[]
  courseId: string
  date: Date
  attendanceImage: string
}

const AttendanceTable = ({ attendanceData, attendanceImage, courseId, date }: AttendanceTableProps) => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [attendance, setAttendance] = useState<{[key: string]: AttendanceStatus}>(
    Object.fromEntries(
      attendanceData.map(data => [data.name, data.has_signed ? "Megjelent" : "Nem jelent meg"])
    )
  )

  const handleAttendanceChange = (name: string, value: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const submitMutation = useMutation({
    mutationFn: async () => {
      const file = base64ToFile(attendanceImage, "attendance.jpg", "image/jpeg");

      const formData = new FormData();
      formData.append("course_id", courseId);
      formData.append("attendanceImage", file);
      formData.append("date", date.toISOString());
      formData.append("students", JSON.stringify(
        Object.entries(attendance).map(([name, status]) => ({
          student_name: name,
          neptun_code: "ASDASD",
          status: status,
        }))
      ));

      const response = await axios.post(
        `${API_URL}/attendance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      navigate(-1);
      toast.success("Jelenléti ív sikeresen mentve");
    },
    onError: () => {
      toast.error("Hiba történt a jelenléti ív mentésekor");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Név</TableHead>
            <TableHead>Megbízhatóság</TableHead>
            <TableHead>Jelenlét</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((data) => (
            <TableRow key={data.name}>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.confidence}%</TableCell>
              <TableCell>
                <AttendanceStatusSelect
                  value={attendance[data.name]}
                  onChange={(value) => handleAttendanceChange(data.name, value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={submitMutation.isPending}
          className="w-[200px]"
        >
          {submitMutation.isPending ? "Mentés..." : "Jelenléti ív mentése"}
        </Button>
      </div>
    </form>
  )
}

export default AttendanceTable
