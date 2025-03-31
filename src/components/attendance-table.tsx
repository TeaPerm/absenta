import React, { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { API_URL, AttendanceData } from '@/lib/constants'
import { base64ToFile, cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface AttendanceTableProps {
  attendanceData: AttendanceData[]
  courseId: string
  date: Date
  attendanceImage: string
}


const AttendanceTable = ({ attendanceData, attendanceImage, courseId, date }: AttendanceTableProps) => {

  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);
  const [attendance, setAttendance] = useState<{[key: string]: string}>(
    Object.fromEntries(
      attendanceData.map(data => [data.name, data.has_signed ? "Megjelent" : "Nem jelent meg"])
    )
  )

  const handleAttendanceChange = (name: string, value: string) => {
    setAttendance(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Megjelent":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "Nem jelent meg":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "Igazoltan távol":
        return "bg-yellow-500 hover:bg-yellow-600 text-white"
      case "Késett":
        return "bg-gray-700 hover:bg-gray-700 text-white"
      default:
        return "bg-white hover:bg-gray-100"
    }
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
                <Select
                  value={attendance[data.name]}
                  onValueChange={(value) => handleAttendanceChange(data.name, value)}
                >
                  <SelectTrigger className={cn("w-[180px]", getStatusColor(attendance[data.name]), "[&_svg]:text-white")}>
                    <SelectValue placeholder="Jelenlét" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Megjelent">Megjelent</SelectItem>
                    <SelectItem value="Igazoltan távol">Igazoltan távol</SelectItem>
                    <SelectItem value="Nem jelent meg">Nem jelent meg</SelectItem>
                    <SelectItem value="Késett">Késett</SelectItem>
                  </SelectContent>
                </Select>
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
