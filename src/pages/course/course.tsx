import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/useCourse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "@/hooks/useAuth";
import { useAppStore } from "@/hooks/useAppStore";
import { useEffect } from "react";
import { Users, Calendar, CheckCircle, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AttendanceStatsCard } from "@/components/attendance-stats-card";
import { AttendancePieChart } from "@/components/attendance-pie-chart";
import { AttendanceTrendChart } from "@/components/attendance-trend-chart";

interface CourseStats {
  courseName: string;
  totalSessions: number;
  students: Array<{
    student_name: string;
    neptun_code: string;
    attended: number;
    missed: number;
    late: number;
    excused: number;
  }>;
  attendances: Array<{
    _id: string;
    course_id: string;
    date: string;
    attendanceImage: {
      _id: string;
      name: string;
      desc: string;
    };
    students: Array<{
      _id: string;
      student_name: string;
      neptun_code: string;
      status: string;
    }>;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface Attendance {
  _id: string;
  course_id: string;
  date: string;
  attendanceImage: {
    _id: string;
    name: string;
    desc: string;
  };
  students: Array<{
    _id: string;
    student_name: string;
    neptun_code: string;
    status: string;
  }>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Course = () => {
  const { courseId } = useParams();
  const { data: course, isLoading, isError, error } = useCourse(courseId);
  const token = useAuthStore((state) => state.token);
  const setActiveCourseId = useAppStore((state) => state.setActiveCourseId);

  // Set active course ID when component mounts
  useEffect(() => {
    if (courseId) {
      setActiveCourseId(courseId);
    }

    // Removed cleanup to keep menu open when navigating between course pages
  }, [courseId, setActiveCourseId]);

  const { data: courseStats, isLoading: statsLoading } = useQuery<CourseStats>({
    queryKey: ["courseStats", courseId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/courses/${courseId}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!courseId && !!token,
  });

  const { data: attendances, isLoading: attendancesLoading } = useQuery<
    Attendance[]
  >({
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
      return response.data;
    },
    enabled: !!courseId && !!token,
  });

  if (isLoading || statsLoading || attendancesLoading) {
    return (
      <div className="flex items-center justify-center h-full">Betöltés...</div>
    );
  }

  if (isError) {
    return (
      <div>Hiba történt a kurzus betöltésekor: {(error as Error).message}</div>
    );
  }

  if (!course) {
    return <div>Kurzus nem található</div>;
  }

  // Calculate overall attendance rate
  const attendanceRate = courseStats
    ? courseStats.students.reduce((acc, student) => {
        const total =
          student.attended + student.missed + student.late + student.excused;
        return total > 0 ? acc + (student.attended / total) * 100 : acc;
      }, 0) / (courseStats.students.length || 1)
    : 0;

  // Calculate total students
  const totalStudents = course.students.length;

  // Get top 5 students by attendance
  const topStudents = courseStats
    ? [...courseStats.students]
        .sort((a, b) => {
          const aTotal = a.attended + a.missed + a.late + a.excused;
          const bTotal = b.attended + b.missed + b.late + b.excused;
          const aRate = aTotal > 0 ? a.attended / aTotal : 0;
          const bRate = bTotal > 0 ? b.attended / bTotal : 0;
          return bRate - aRate;
        })
        .slice(0, 5)
    : [];

  // Get students with 3 or more missed attendances (top 5)
  const studentsWithThreeOrMoreAbsences = courseStats
    ? [...courseStats.students]
        .filter((student) => student.missed >= 3)
        .sort((a, b) => b.missed - a.missed)
        .slice(0, 5)
    : [];

  // Process attendance data for the chart
  const attendanceChartData = attendances
    ? [...attendances]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((attendance) => {
          const attendedCount = attendance.students.filter(
            (student) => student.status === "Megjelent"
          ).length;
          const missedCount = attendance.students.filter(
            (student) => student.status === "Nem jelent meg"
          ).length;
          return {
            date: new Date(attendance.date).toLocaleDateString("hu-HU", {
              month: "short",
              day: "numeric",
            }),
            attended: attendedCount,
            missed: missedCount,
            total: attendance.students.length,
          };
        })
    : [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Course Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{course.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{course.university}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Összes hallgató
            </CardTitle>
            <Users className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Aktív hallgatók száma
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Összes óra</CardTitle>
            <Calendar className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courseStats?.totalSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">Összes jelenléti ív</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jelenléti arány
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceRate.toFixed(1)}%
            </div>
            <Progress value={attendanceRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jelenléti státusz
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceRate >= 75
                ? "Jó"
                : attendanceRate >= 50
                ? "Közepes"
                : "Gyenge"}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendanceRate >= 75
                ? "Több mint 75% jelenlét"
                : attendanceRate >= 50
                ? "50-75% jelenlét"
                : "Kevesebb mint 50% jelenlét"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AttendanceStatsCard
          stats={courseStats?.students || []}
          className="col-span-2"
        />

        <AttendancePieChart
          stats={courseStats?.students || []}
          className="col-span-2"
        />
      </div>

      <AttendanceTrendChart data={attendanceChartData} />

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Áttekintés</TabsTrigger>
          <TabsTrigger value="students">Hallgatók</TabsTrigger>
          <TabsTrigger value="attendance">Jelenlét</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legjobb jelenlét</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Név</TableHead>
                      <TableHead className="text-right">Jelenlét</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((student) => {
                      const total =
                        student.attended +
                        student.missed +
                        student.late +
                        student.excused;
                      const rate =
                        total > 0 ? (student.attended / total) * 100 : 0;
                      return (
                        <TableRow key={student.neptun_code}>
                          <TableCell className="font-medium">
                            {student.student_name}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span>{rate.toFixed(1)}%</span>
                              <Progress value={rate} className="w-20" />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">3 vagy több hiányzás</CardTitle>
                <Link to="students">
                  <Button variant="outline" size="sm">
                    Összes megtekintése
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {studentsWithThreeOrMoreAbsences.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Név</TableHead>
                        <TableHead className="text-right">Hiányzások</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsWithThreeOrMoreAbsences.map((student) => (
                        <TableRow key={student.neptun_code}>
                          <TableCell className="font-medium">
                            {student.student_name}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span>{student.missed}</span>
                              <Progress
                                value={
                                  (student.missed /
                                    (courseStats?.totalSessions || 1)) *
                                  100
                                }
                                className="w-20 "
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Nincs olyan hallgató, aki 3 vagy több alkalommal hiányzott
                      volna.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hallgatók listája</CardTitle>
              <Link to="students">
                <Button variant="outline" size="sm">
                  Részletes statisztikák
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="grid grid-cols-2 gap-4 p-4 border-b bg-muted">
                  <div className="font-medium">Neptun kód</div>
                  <div className="font-medium">Név</div>
                </div>
                <div className="divide-y">
                  {course.students.map((student) => (
                    <div
                      key={student.neptun_code}
                      className="grid grid-cols-2 gap-4 p-4 hover:bg-muted/50"
                    >
                      <div className="font-mono">{student.neptun_code}</div>
                      <div>{student.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Jelenléti ívek</CardTitle>
              <div className="flex gap-2">
                <Link to="attendance">
                  <Button variant="outline" size="sm">
                    Jelenléti ívek kezelése
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendances && attendances.length > 0 ? (
                  attendances.map((attendance) => (
                    <Card key={attendance._id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {new Date(attendance.date).toLocaleDateString(
                            "hu-HU",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Név</TableHead>
                                <TableHead>Neptun kód</TableHead>
                                <TableHead>Státusz</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {attendance.students.map((student) => (
                                <TableRow key={student._id}>
                                  <TableCell>{student.student_name}</TableCell>
                                  <TableCell className="font-mono">
                                    {student.neptun_code}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        student.status === "Megjelent"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {student.status}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      Nincsenek jelenléti ívek
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Még nem lett feltöltve jelenléti ív ehhez a kurzushoz.
                    </p>
                    <Link to="attendance">
                      <Button>Jelenléti ív létrehozása</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Course;
