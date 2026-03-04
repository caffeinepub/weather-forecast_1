import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
  "data-ocid"?: string;
}

export function AdPlaceholder({
  width,
  height,
  label = "Advertisement",
  className,
  "data-ocid": dataOcid,
}: AdPlaceholderProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "ad-placeholder rounded-lg flex flex-col items-center justify-center gap-1.5 text-center select-none",
        className,
      )}
      style={width && height ? { minHeight: height, width: "100%" } : undefined}
      aria-label={label}
      role="complementary"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 font-body">
        {label}
      </span>
      {width && height && (
        <span className="text-[10px] text-muted-foreground/40 font-body">
          {width}×{height}
        </span>
      )}
    </div>
  );
}
