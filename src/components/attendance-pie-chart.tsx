import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Pie, PieChart, Label, Cell } from "recharts"

interface StudentStats {
  attended: number
  missed: number
  late: number
  excused: number
}

interface AttendanceDonutChartProps {
  stats: StudentStats[]
  className?: string
}

export function AttendancePieChart({ stats, className }: AttendanceDonutChartProps) {
  const totalAttendance = stats.reduce((acc, student) => acc + student.attended, 0)
  const totalMissed = stats.reduce((acc, student) => acc + student.missed, 0)
  const totalLate = stats.reduce((acc, student) => acc + student.late, 0)
  const totalExcused = stats.reduce((acc, student) => acc + student.excused, 0)

  const totalAll = totalAttendance + totalMissed + totalLate + totalExcused

  const chartData = [
    { name: "Megjelent", value: totalAttendance, color: "#22c55e" },
    { name: "Nem jelent meg", value: totalMissed, color: "#ef4444" },
    { name: "Késett", value: totalLate, color: "#eab308" },
    { name: "Igazoltan távol", value: totalExcused, color: "#3b82f6" },
  ]

  const chartConfig: ChartConfig = {
    "Megjelent": { label: "Megjelent", color: "#22c55e" },
    "Nem jelent meg": { label: "Nem jelent meg", color: "#ef4444" },
    "Késett": { label: "Késett", color: "#eab308" },
    "Igazoltan távol": { label: "Igazoltan távol", color: "#3b82f6" },
  }

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Jelenléti eloszlás</CardTitle>
        <CardDescription>Féléves összesített adatok</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Aktuális féléves statisztika <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Megjelenés, hiányzás és késés adatok összesítve
        </div>
      </CardFooter>
    </Card>
  )
}
