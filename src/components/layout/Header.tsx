import { Menu, Moon, Sun, Triangle } from "lucide-react";
  import { useTheme } from "@/hooks/use-theme";
  import { Link } from "wouter";

  interface HeaderProps {
    onMenuClick: () => void;
  }

  export function Header({ onMenuClick }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    return (
      <header className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Triangle className="w-4 h-4 text-primary fill-primary/30" />
            <span className="font-bold text-sm">Kotlin</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>
    );
  }
  