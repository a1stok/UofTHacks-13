import { ThemeToggle } from "components/theme-toggle";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";
import { type ChartConfig, ChartContainer } from "~/components/ui/chart";
import { useSlides } from "./slide-context";

const chartConfig = {
  progress: {
    label: "Progress",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

function ProgressChart() {
  const { currentSlide, totalSlides } = useSlides();
  const progress = ((currentSlide + 1) / totalSlides) * 100;
  const endAngle = (progress / 100) * 360;

  const chartData = [{ progress, fill: "var(--color-progress)" }];

  return (
    <ChartContainer config={chartConfig} className="aspect-square h-6 w-6">
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 - endAngle}
        innerRadius={8}
        outerRadius={12}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-background"
          polarRadius={[11, 9]}
        />
        <RadialBar dataKey="progress" cornerRadius={10} />
      </RadialBarChart>
    </ChartContainer>
  );
}

export default function Toolbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full p-4 flex gap-4">
      <ThemeToggle />
      <div className="flex-grow">

      </div>
      <ProgressChart />
    </nav>
  );
}
