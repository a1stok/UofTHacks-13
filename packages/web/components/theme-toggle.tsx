import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme-provider";

function ThemeIcon({ children }: { children: React.ReactNode }) {
  return <div className="w-6 h-6 cursor-pointer ">{children}</div>;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="cursor-pointer flex justify-center items-center text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <SunIcon className="size-4" />
      ) : theme === "dark" ? (
        <MoonIcon className="size-4" />
      ) : (
        <MonitorIcon className="size-4" />
      )}
    </button>
  );
}
