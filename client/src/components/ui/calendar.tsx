import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected || new Date()
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrev = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-7 w-7" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected =
      selected &&
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === d;

    const isToday =
      new Date().getFullYear() === year &&
      new Date().getMonth() === month &&
      new Date().getDate() === d;

    days.push(
      <button
        key={`day-${d}`}
        type="button"
        onClick={() => onSelect && onSelect(new Date(year, month, d))}
        className={cn(
          "h-7 w-7 text-xs rounded-md flex items-center justify-center font-normal transition-colors",
          isSelected
            ? "bg-primary text-primary-foreground font-semibold"
            : isToday
            ? "border border-border text-foreground font-medium"
            : "hover:bg-accent hover:text-accent-foreground text-foreground"
        )}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={cn("p-3 bg-card rounded-lg border border-border w-64 select-none", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground">
          {monthNames[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground font-medium mb-1">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}
