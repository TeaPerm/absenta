
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AttendanceTrendItem {
  date: string
  attended: number
  missed: number
  total: number
}

interface AttendanceTrendChartProps {
  data: AttendanceTrendItem[]
  className?: string
}

export function AttendanceTrendChart({ data, className }: AttendanceTrendChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Jelenléti trend</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="natural"
                  dataKey="attended"
                  name="Megjelent"
                  stroke="#22c55e"
                  fill="#dcfce7"
                  fillOpacity={0.8}
                />
                <Area
                  type="natural"
                  dataKey="missed"
                  name="Nem jelent meg"
                  stroke="#ef4444"
                  fill="#fee2e2"
                  fillOpacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nincs elég adat a trend megjelenítéséhez.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 