import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCourse } from "@/hooks/useCourse";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, AlertCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudentStats {
  student_name: string;
  neptun_code: string;
  totalSessions: number;
  attended: number;
  missed: number;
  late: number;
  excused: number;
}

interface CourseStats {
  courseName: string;
  totalSessions: number;
  students: StudentStats[];
}

export function Students() {
  const { courseId } = useParams();
  const { data: course, isLoading: courseLoading, isError: courseError, error: courseErrorMsg } = useCourse(courseId);
  const token = useAuthStore((state) => state.token);

  const { data: stats, isLoading: statsLoading, isError: statsError, error: statsErrorMsg } = useQuery<CourseStats>({
    queryKey: ["courseStats", courseId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/courses/${courseId}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch course stats");
      }
      return response.json();
    },
    enabled: !!courseId && !!token,
  });

  if (courseLoading || statsLoading) {
    return <div>Loading course data...</div>;
  }

  if (courseError || statsError) {
    return <div>Error loading course: {(courseErrorMsg || statsErrorMsg)?.toString()}</div>;
  }

  const courseStats = stats || { courseName: course?.name || "", totalSessions: 0, students: [] };

  const totalStudents = courseStats.students.length;
  const totalAttendance = courseStats.students.reduce((sum, student) => sum + student.attended, 0);
  const totalMissed = courseStats.students.reduce((sum, student) => sum + student.missed, 0);
  const totalLate = courseStats.students.reduce((sum, student) => sum + student.late, 0);
  const totalExcused = courseStats.students.reduce((sum, student) => sum + student.excused, 0);
  
  const attendanceRate = totalStudents > 0 ? (totalAttendance / (totalStudents * courseStats.totalSessions)) * 100 : 0;

  return (
    <Container className="py-2 sm:py-4 md:py-6 h-full">
      <div className="space-y-3 sm:space-y-4 md:space-y-6 h-full flex flex-col">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Hallgatók</h1>
          <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
            {courseStats.courseName} - Jelenléti statisztikák
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card className="p-2 sm:p-3 md:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Összes óra</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1 sm:pt-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{courseStats.totalSessions}</div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Jelenléti arány</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1 sm:pt-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
              <Progress value={attendanceRate} className="mt-1 sm:mt-2" />
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Összes hallgató</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1 sm:pt-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card className="p-2 sm:p-3 md:p-4">
            <CardHeader className="pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Jelenléti állapot</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-1 sm:pt-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                <span className="text-xs sm:text-sm">{totalAttendance} jelen</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                <span className="text-xs sm:text-sm">{totalMissed} hiányzik</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                <span className="text-xs sm:text-sm">{totalLate} késő</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                <span className="text-xs sm:text-sm">{totalExcused} igazolt</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Hallgatói jelenléti statisztikák</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4 md:p-6 flex-1 flex flex-col">
            <div className="overflow-x-auto -mx-4 sm:mx-0 flex-1">
              <div className="max-w-[400px] lg:max-w-[800px] px-4 sm:px-0 h-full">
                <Table maxWidth="600px">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[5%] sm:w-[10%]">#</TableHead>
                      <TableHead className="w-[25%] sm:w-[30%]">Név</TableHead>
                      <TableHead className="w-[15%]">Neptun kód</TableHead>
                      <TableHead className="w-[10%] text-center">Jelen</TableHead>
                      <TableHead className="w-[10%] text-center">Hiányzik</TableHead>
                      <TableHead className="w-[10%] text-center">Késő</TableHead>
                      <TableHead className="w-[10%] text-center">Igazolt</TableHead>
                      <TableHead className="w-[15%] text-center">Jelenléti arány</TableHead>
                      <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseStats.students.map((student, index) => {
                      const attendanceRate = student.totalSessions > 0 
                        ? (student.attended / student.totalSessions) * 100 
                        : 0;
                      
                      return (
                        <TableRow 
                          key={student.neptun_code}
                          className={student.missed >= 3 ? "bg-red-50 hover:bg-red-100" : ""}
                        >
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="text-sm sm:text-base">{student.student_name}</TableCell>
                          <TableCell className="font-mono uppercase text-xs sm:text-sm">{student.neptun_code}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-green-600 font-medium text-sm">{student.attended}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-red-600 font-medium text-sm">{student.missed}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-yellow-600 font-medium text-sm">{student.late}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-blue-600 font-medium text-sm">{student.excused}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <Progress value={attendanceRate} className="w-[40px] sm:w-[60px]" />
                              <span className="text-xs sm:text-sm font-medium">{attendanceRate.toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[5%]">
                            {student.missed >= 3 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-red-500 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>3 vagy több hiányzás</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
