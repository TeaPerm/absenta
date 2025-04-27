import { TrendingUp, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Label, Cell } from "recharts";

interface StudentStats {
  attended: number;
  missed: number;
  late: number;
  excused: number;
}

interface AttendanceDonutChartProps {
  stats: StudentStats[];
  className?: string;
}

export function AttendancePieChart({
  stats,
  className,
}: AttendanceDonutChartProps) {
  const totalAttendance = stats.reduce(
    (acc, student) => acc + student.attended,
    0
  );
  const totalMissed = stats.reduce((acc, student) => acc + student.missed, 0);
  const totalLate = stats.reduce((acc, student) => acc + student.late, 0);
  const totalExcused = stats.reduce((acc, student) => acc + student.excused, 0);

  const totalAll = totalAttendance + totalMissed + totalLate + totalExcused;
  const hasData = totalAll > 0;

  const chartData = [
    {
      name: "Megjelent",
      value: totalAttendance,
      color: "oklch(58.8% 0.158 241.966)",
    },
    {
      name: "Nem jelent meg",
      value: totalMissed,
      color: "oklch(88.5% 0.062 18.334)",
    },
    { name: "Késett", value: totalLate, color: "#eab308" },
    {
      name: "Igazoltan távol",
      value: totalExcused,
      color: "oklch(70.4% 0.04 256.788)",
    },
  ];

  const chartConfig: ChartConfig = {
    Megjelent: { label: "Megjelent", color: "oklch(58.8% 0.158 241.966)" },
    "Nem jelent meg": {
      label: "Nem jelent meg",
      color: "oklch(80.8% 0.114 19.571)",
    },
    Késett: { label: "Késett", color: "#eab308" },
    "Igazoltan távol": {
      label: "Igazoltan távol",
      color: "oklch(70.4% 0.04 256.788)",
    },
  };

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Jelenléti eloszlás</CardTitle>
        <CardDescription>Féléves összesített adatok</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalAll.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            alkalom
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[250px] text-center p-4">
            <AlertCircle className="h-10 w-10 text-theme mb-2" />
            <h3 className="text-lg font-medium">Nincs megjeleníthető adat</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Még nem állnak rendelkezésre jelenléti adatok
            </p>
          </div>
        )}
      </CardContent>
      {hasData && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Aktuális féléves statisztika <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Megjelenés, hiányzás és késés adatok összesítve
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
