import * as React from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  autoScroll?: boolean;
}

const MessageScroller = React.forwardRef<HTMLDivElement, MessageScrollerProps>(
  ({ className, autoScroll = true, children, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = React.useState(true);

    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 30;
      setIsAtBottom(atBottom);
    };

    React.useEffect(() => {
      if (autoScroll && isAtBottom) {
        scrollToBottom();
      }
    });

    return (
      <div ref={ref} className={cn("relative flex h-full flex-col overflow-hidden", className)} {...props}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto space-y-1 p-3"
        >
          {children}
        </div>
        {!isAtBottom && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={scrollToBottom}
            className="absolute bottom-3 right-3 shadow-lg gap-1.5 text-[11px] h-7 px-2.5 bg-card border border-border"
          >
            <ArrowDown className="h-3 w-3" />
            <span>Scroll to bottom</span>
          </Button>
        )}
      </div>
    );
  }
);
MessageScroller.displayName = "MessageScroller";

export { MessageScroller };
