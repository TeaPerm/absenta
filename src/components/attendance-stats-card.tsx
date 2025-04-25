import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface StudentStats {
  attended: number;
  missed: number;
  late: number;
  excused: number;
}

interface AttendanceStatsCardProps {
  stats: StudentStats[];
  className?: string;
}

export function AttendanceStatsCard({ stats, className }: AttendanceStatsCardProps) {
  const totalAttendance = stats.reduce((acc, student) => acc + student.attended, 0);
  const totalMissed = stats.reduce((acc, student) => acc + student.missed, 0);
  const totalLate = stats.reduce((acc, student) => acc + student.late, 0);
  const totalExcused = stats.reduce((acc, student) => acc + student.excused, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Jelenléti statisztikák</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-4 lg:grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-theme/20 rounded-lg">
            <CheckCircle className="h-8 w-8 text-theme mb-2" />
            <div className="text-2xl font-bold text-theme">
              {totalAttendance}
            </div>
            <div className="text-sm text-theme">Megjelent</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
            <XCircle className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {totalMissed}
            </div>
            <div className="text-sm text-red-600">Nem jelent meg</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="h-8 w-8 text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {totalLate}
            </div>
            <div className="text-sm text-yellow-600">Késett</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {totalExcused}
            </div>
            <div className="text-sm text-blue-600">Igazoltan távol</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 