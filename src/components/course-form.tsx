import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/useAuth";
import { Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Student {
  neptun_code: string;
  name: string;
}

export interface CourseFormData {
  name: string;
  university: string;
  students: Student[];
}

export const courseFormSchema = z
  .object({
    name: z.string().min(1, "A kurzus neve kötelező"),
    university: z.string(),
    students: z.array(
      z.object({
        neptun_code: z.string().length(6, "A Neptun kódnak pontosan 6 karakterből kell állnia"),
        name: z.string().min(1, "A név megadása kötelező"),
      })
    ),
  })
  .strict();

interface CourseFormProps {
  initialData?: CourseFormData;
  courseId?: string;
  university: string;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export function CourseForm({ initialData, courseId, university, mode, onSuccess }: CourseFormProps) {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [students, setStudents] = useState<Student[]>(initialData?.students || []);
  const [newStudent, setNewStudent] = useState<Student>({ name: '', neptun_code: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      university: initialData?.university || university,
      students: initialData?.students || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      // Create a properly typed object for form.reset
      const formData: z.infer<typeof courseFormSchema> = {
        name: initialData.name,
        university: initialData.university,
        students: initialData.students,
      };
      form.reset(formData);
      setStudents(initialData.students || []);
    }
  }, [initialData, form]);

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
    form.setValue('students', updatedStudents);
  };

  const handleAddStudent = () => {
    if (newStudent.name && isValidNeptunCode(newStudent.neptun_code)) {
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      form.setValue('students', updatedStudents);
      setNewStudent({ name: '', neptun_code: '' });
    }
  };

  const handleRemoveStudent = (index: number) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
    form.setValue('students', updatedStudents);
  };

  const courseMutation = useMutation({
    mutationFn: async (values: z.infer<typeof courseFormSchema>) => {
      const url = mode === 'create' 
        ? `${API_URL}/courses` 
        : `${API_URL}/courses/${courseId}`;
      
      const method = mode === 'create' ? 'post' : 'put';
      
      const response = await axios[method](
        url,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(mode === 'create' ? "Kurzus sikeresen létrehozva" : "Kurzus sikeresen frissítve");
      queryClient.invalidateQueries({ queryKey: ["courses", university] });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/${university}`);
      }
    },
    onError: () => {
      toast.error(mode === 'create' ? "Hiba történt a kurzus létrehozása közben" : "Hiba történt a kurzus frissítése közben");
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `${API_URL}/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Kurzus sikeresen törölve");
      queryClient.invalidateQueries({ queryKey: ["courses", university] });
      navigate(`/${university}`);
    },
    onError: () => {
      toast.error("Hiba történt a kurzus törlése közben");
    },
  });

  const handleDelete = () => {
    deleteCourseMutation.mutate();
    setDeleteDialogOpen(false);
  };

  function onSubmit(values: z.infer<typeof courseFormSchema>) {
    courseMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8 flex-1 flex flex-col">
        <Card className="p-3 sm:p-4 md:p-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Alapadatok</h2>
          <div className="grid gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurzus neve</FormLabel>
                    <FormControl>
                      <Input placeholder="Kurzus neve" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <FormLabel htmlFor="new-name">Új hallgató neve</FormLabel>
                <Input
                  id="new-name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Hallgató neve"
                  className="w-full"
                />
              </div>
              <div>
                <FormLabel htmlFor="new-neptun">Neptun kód</FormLabel>
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
          {mode === 'edit' && (
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
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
                    onClick={handleDelete}
                    disabled={deleteCourseMutation.isPending}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {deleteCourseMutation.isPending ? "Törlés..." : "Törlés"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/${university}`)}
            className="text-xs sm:text-sm"
          >
            Mégse
          </Button>
          <Button
            type="submit"
            disabled={courseMutation.isPending}
            className="text-xs sm:text-sm"
          >
            {courseMutation.isPending ? (mode === 'create' ? "Létrehozás..." : "Mentés...") : (mode === 'create' ? "Létrehozás" : "Mentés")}
          </Button>
        </div>
      </form>
    </Form>
  );
} 