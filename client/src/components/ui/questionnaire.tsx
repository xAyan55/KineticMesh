import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuestionnaireStep {
  id: string;
  title: string;
  description?: string;
}

export interface QuestionnaireProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: QuestionnaireStep[];
  currentStep: number;
  onStepChange?: (step: number) => void;
}

const Questionnaire = React.forwardRef<HTMLDivElement, QuestionnaireProps>(
  ({ className, steps, currentStep, onStepChange, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Step Indicator Header */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-border pb-4">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepChange && isCompleted && onStepChange(idx)}
                disabled={!isCompleted && !isCurrent}
                className={cn(
                  "flex items-center gap-2.5 p-2 rounded-md text-left transition-colors",
                  isCurrent
                    ? "bg-secondary text-foreground"
                    : isCompleted
                    ? "text-muted-foreground hover:text-foreground cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-mono font-semibold",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{step.title}</p>
                  {step.description && (
                    <p className="truncate text-[10px] text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    );
  }
);
Questionnaire.displayName = "Questionnaire";

const QuestionnaireContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4 animate-in fade-in-50", className)} {...props} />
));
QuestionnaireContent.displayName = "QuestionnaireContent";

export { Questionnaire, QuestionnaireContent };
