import { useEffect, useRef } from "react";

interface AdUnitProps {
  className?: string;
  "data-ocid"?: string;
  style?: React.CSSProperties;
}

// Auto (responsive) ad unit — AdSense will pick the best format
export function AdUnit({
  className,
  "data-ocid": dataOcid,
  style,
}: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // Standard AdSense initialization: ensure the global queue exists then push
      // @ts-expect-error adsbygoogle is injected by the AdSense script
      if (!window.adsbygoogle) window.adsbygoogle = [];
      // @ts-expect-error adsbygoogle is injected by the AdSense script
      (window.adsbygoogle as unknown[]).push({});
    } catch (_) {
      // ignore errors in dev / blocked environments
    }
  }, []);

  return (
    <div ref={ref} data-ocid={dataOcid} className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-7862940350288494"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
