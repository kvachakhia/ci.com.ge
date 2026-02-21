import { cn } from "@/lib/utils";

export default function SectionHeader(props: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  testId?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="min-w-0">
        {props.eyebrow ? (
          <div
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1 text-xs font-semibold text-muted-foreground"
            data-testid={props.testId ? `${props.testId}-eyebrow` : undefined}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/90" />
            <span>{props.eyebrow}</span>
          </div>
        ) : null}
        <h1
          className={cn("mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.03] text-shine")}
          data-testid={props.testId}
        >
          {props.title}
        </h1>
        {props.description ? (
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {props.description}
          </p>
        ) : null}
      </div>
      {props.right ? <div className="shrink-0">{props.right}</div> : null}
    </div>
  );
}
