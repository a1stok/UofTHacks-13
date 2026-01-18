import { Area, AreaChart, XAxis } from "recharts";
import { type ChartConfig, ChartContainer } from "~/components/ui/chart";

const data = [
  { month: "Jan", satisfaction: 62, conversion: 45 },
  { month: "Feb", satisfaction: 65, conversion: 48 },
  { month: "Mar", satisfaction: 68, conversion: 52 },
  { month: "Apr", satisfaction: 72, conversion: 58 },
  { month: "May", satisfaction: 78, conversion: 65 },
  { month: "Jun", satisfaction: 85, conversion: 72 },
  { month: "Jul", satisfaction: 91, conversion: 78 },
];

const chartConfig = {
  satisfaction: {
    label: "Satisfaction",
    color: "var(--success)",
  },
  conversion: {
    label: "Conversion",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function MetricsChart() {
  return (
    <div className="w-full h-full rounded-lg border border-border bg-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
        <span className="text-xs text-muted-foreground font-mono">
          User Metrics
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Satisfaction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-chart-1" />
            <span className="text-xs text-muted-foreground">Conversion</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="conversion"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#conversionGradient)"
            />
            <Area
              type="monotone"
              dataKey="satisfaction"
              stroke="var(--success)"
              strokeWidth={2}
              fill="url(#satisfactionGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Footer stats */}
      <div className="px-3 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-success">91%</div>
            <div className="text-xs text-muted-foreground">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-chart-1">+73%</div>
            <div className="text-xs text-muted-foreground">Conversion</div>
          </div>
        </div>
        <span className="text-xs text-success font-medium">
          Trending up
        </span>
      </div>
    </div>
  );
}
