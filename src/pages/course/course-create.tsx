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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/useAuth";
import { Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "@/lib/constants";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

interface Student {
  neptun_code: string;
  name: string;
}

const courseCreateSchema = z
  .object({
    name: z.string().min(1),
    university: z.string(),
    dayOfWeek: z.enum(daysOfWeek),
    startTime: z.string(),
    endTime: z.string(),
    location: z.string().optional(),
    students: z.array(
      z.object({
        neptun_code: z.string().length(6, "Neptun code must be exactly 6 characters"),
        name: z.string().min(1),
      })
    ),
  })
  .strict();

export function CourseCreate() {
  const token = useAuthStore((state) => state.token);
  const { university } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof courseCreateSchema>>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      name: "",
      university: university!,
      dayOfWeek: "Monday",
      startTime: "",
      endTime: "",
      location: "",
      students: [{ neptun_code: "", name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "students",
  });

  const createCourseMutation = useMutation({
    mutationFn: async (values: z.infer<typeof courseCreateSchema>) => {
      const response = await axios.post(
        `${API_URL}/courses`,
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
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: ["courses", university] });
      navigate(`/${university}`);
    },
    onError: () => {
      toast.error("Failed to create course");
    },
  });

  function onSubmit(values: z.infer<typeof courseCreateSchema>) {
    createCourseMutation.mutate(values);
  }

  return (
    <>
    <div className="max-w-full mx-auto lg:mx-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Új kurzus létrehozása</h1>
          <p className="text-muted-foreground">
            Add meg az új kurzus adatait.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Course details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kurzus neve</FormLabel>
                        <FormControl>
                          <Input placeholder="Kurzus neve" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dayOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nap</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Válassz napot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kezdés</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={5} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot  index={0} />
                              <InputOTPSlot index={1} />
                              <span className="mx-1">:</span>
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Befejezés</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={5} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <span className="mx-1">:</span>
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Helyszín</FormLabel>
                        <FormControl>
                          <Input placeholder="Helyszín" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/${university}`)}
                  >
                    Mégse
                  </Button>
                  <Button type="submit" disabled={createCourseMutation.isPending}>
                    {createCourseMutation.isPending ? "Létrehozás..." : "Létrehozás"}
                  </Button>
                </div>
              </div>

              {/* Right column - Student list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Tanulók</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (fields.length > 1) {
                          remove(fields.length - 1);
                        }
                      }}
                    >
                      -
                    </Button>
                    <Input
                      min={1}
                      value={fields.length}
                      onChange={(e) => {
                        const newCount = Math.max(1, parseInt(e.target.value) || 1);
                        const currentCount = fields.length;
                        
                        if (newCount === currentCount) return;
                        
                        if (newCount > currentCount) {
                          // Add new fields
                          const fieldsToAdd = newCount - currentCount;
                          for (let i = 0; i < fieldsToAdd; i++) {
                            append({ neptun_code: "", name: "" } as Student);
                          }
                        } else {
                          // Remove fields
                          const fieldsToRemove = currentCount - newCount;
                          for (let i = 0; i < fieldsToRemove; i++) {
                            remove(currentCount - 1 - i);
                          }
                        }
                      }}
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => append({ neptun_code: "", name: "" } as Student)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 ">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`students.${index}.neptun_code`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Neptun kód</FormLabel>
                            <FormControl>
                              <Input placeholder="ABC123" maxLength={6} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`students.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Név</FormLabel>
                            <FormControl>
                              <Input placeholder="Tanuló neve" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="flex justify-center mb-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}