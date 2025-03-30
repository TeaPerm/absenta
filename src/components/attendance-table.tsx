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
import { AttendanceData } from '@/lib/constants'

interface AttendanceTableProps {
  attendanceData: AttendanceData[]
}

const AttendanceTable = ({ attendanceData }: AttendanceTableProps) => {
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

  return (
    <div className="w-full">
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
                  <SelectTrigger className="w-[180px]">
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
    </div>
  )
}

export default AttendanceTable
