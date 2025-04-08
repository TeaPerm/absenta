import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourse';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from 'lucide-react';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DAYS_OF_WEEK_HU = {
  "Monday": "Hétfő",
  "Tuesday": "Kedd",
  "Wednesday": "Szerda",
  "Thursday": "Csütörtök",
  "Friday": "Péntek",
  "Saturday": "Szombat",
  "Sunday": "Vasárnap",
} as const;

interface CourseFormData {
  name: string;
  dayOfWeek: typeof DAYS_OF_WEEK[number];
  startTime: string;
  endTime: string;
  students: {
    neptun_code: string;
    name: string;
  }[];
}

interface Student {
  neptun_code: string;
  name: string;
}

const CourseSettings = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const { data: course, isLoading, isError, error } = useCourse(courseId);
  const queryClient = useQueryClient();
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState<Student>({ name: '', neptun_code: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  React.useEffect(() => {
    if (course) {
      setStudents(course.students);
    }
  }, [course]);

  const updateCourseMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Kurzus sikeresen frissítve');
      navigate(`/${course?.university}/${courseId}`);
    },
    onError: () => {
      toast.error('Hiba történt a kurzus frissítése közben');
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/courses/${courseId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Hiba történt a kurzus törlése közben');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Kurzus sikeresen törölve');
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.message || 'Hiba történt a kurzus törlése közben');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CourseFormData = {
      name: formData.get('name') as string,
      dayOfWeek: formData.get('dayOfWeek') as typeof DAYS_OF_WEEK[number],
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      students: students,
    };
    updateCourseMutation.mutate(data);
  };

  const isValidNeptunCode = (code: string) => {
    return /^[A-Z0-9]{6}$/.test(code);
  };

  const handleStudentChange = (index: number, field: keyof Student, value: string) => {
    const updatedStudents = [...students];
    if (field === 'neptun_code') {
      // Only allow uppercase letters and numbers
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    }
    updatedStudents[index] = {
      ...updatedStudents[index],
      [field]: value,
    };
    setStudents(updatedStudents);
  };

  const handleAddStudent = () => {
    if (newStudent.name && isValidNeptunCode(newStudent.neptun_code)) {
      setStudents([...students, newStudent]);
      setNewStudent({ name: '', neptun_code: '' });
    }
  };

  const handleRemoveStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  if (isError) {
    return <div>Hiba történt: {error.message}</div>;
  }

  if (!course) {
    return <div>Nem található kurzus</div>;
  }

  return (
    <Container className="py-2 sm:py-4 md:py-6 h-full">
      <div className="space-y-3 sm:space-y-4 md:space-y-6 h-full flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Kurzus beállítások</h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Itt módosíthatja a kurzus alapvető beállításait.
            </p>
          </div>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="text-xs sm:text-sm"
              >
                Kurzus törlése
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Kurzus törlése</DialogTitle>
                <DialogDescription>
                  Biztosan törölni szeretné ezt a kurzust? Ez a művelet nem visszavonható.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Mégse
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteCourseMutation.mutate();
                    setDeleteDialogOpen(false);
                  }}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Törlés
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8 flex-1 flex flex-col">
          <Card className="p-3 sm:p-4 md:p-6">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Alapadatok</h2>
            <div className="grid gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="name">Kurzus neve</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={course.name}
                  required
                  className="w-full"
                />
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="dayOfWeek">Nap</Label>
                  <Select name="dayOfWeek" defaultValue={course.dayOfWeek}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day} value={day}>
                          {DAYS_OF_WEEK_HU[day]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="startTime">Kezdési időpont</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    defaultValue={course.startTime}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="endTime">Befejezési időpont</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    defaultValue={course.endTime}
                    required
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">Hallgatók ({students.length})</h2>
            </div>
            <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px_40px] gap-2 sm:gap-3 items-end">
                <div>
                  <Label htmlFor="new-name">Új hallgató neve</Label>
                  <Input
                    id="new-name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Hallgató neve"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="new-neptun">Neptun kód</Label>
                  <Input
                    id="new-neptun"
                    value={newStudent.neptun_code}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                      setNewStudent({ ...newStudent, neptun_code: value });
                    }}
                    placeholder="NEPTUN"
                    className={`w-full font-mono uppercase ${newStudent.neptun_code && !isValidNeptunCode(newStudent.neptun_code) ? 'border-red-500' : ''}`}
                  />
                  {newStudent.neptun_code && !isValidNeptunCode(newStudent.neptun_code) && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">A Neptun kódnak pontosan 6 karakterből kell állnia (A-Z, 0-9)</p>
                  )}
                </div>
                <Button 
                  type="button"
                  onClick={handleAddStudent}
                  disabled={!newStudent.name || !newStudent.neptun_code}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="max-h-[300px] sm:max-h-[400px] overflow-auto border rounded-md flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 sm:w-12 bg-white sticky top-0">#</TableHead>
                      <TableHead className="bg-white sticky top-0">Név</TableHead>
                      <TableHead className="w-28 sm:w-32 bg-white sticky top-0">Neptun kód</TableHead>
                      <TableHead className="w-12 sm:w-16 bg-white sticky top-0"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-slate-500 text-xs sm:text-sm">{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={student.name}
                            onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                            className="w-full text-xs sm:text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={student.neptun_code}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                              handleStudentChange(index, 'neptun_code', value);
                            }}
                            className={`w-full font-mono uppercase text-xs sm:text-sm ${!isValidNeptunCode(student.neptun_code) ? 'border-red-500' : ''}`}
                          />
                          {!isValidNeptunCode(student.neptun_code) && (
                            <p className="text-xs sm:text-sm text-red-500 mt-1">A Neptun kódnak pontosan 6 karakterből kell állnia (A-Z, 0-9)</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveStudent(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2 sm:gap-4 mt-auto pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStudents(course.students);
                window.location.reload();
              }}
              className="text-xs sm:text-sm"
            >
              Visszaállítás
            </Button>
            <Button
              type="submit"
              disabled={updateCourseMutation.isPending}
              className="text-xs sm:text-sm"
            >
              {updateCourseMutation.isPending ? "Mentés..." : "Mentés"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default CourseSettings;
