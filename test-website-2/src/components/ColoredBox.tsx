import { cn } from "@/lib/utils"

interface ColoredBoxProps {
  color: "red" | "blue"
  children?: React.ReactNode
  className?: string
}

export function ColoredBox({ color, children, className }: ColoredBoxProps) {
  const colorClasses = {
    red: "bg-red-500 border-red-600 text-white",
    blue: "bg-blue-500 border-blue-600 text-white"
  }

  return (
    <div
      className={cn(
        "p-6 rounded-lg border-2 shadow-lg transition-all duration-200 hover:shadow-xl",
        colorClasses[color],
        className
      )}
    >
      <div className="mb-2 font-semibold text-sm uppercase tracking-wide">
        {color}
      </div>
      {children}
    </div>
  )
}