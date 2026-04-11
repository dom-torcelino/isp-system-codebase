import { cn } from "./utils";

const shimmerStyle = `
@keyframes skeleton-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

let styleInjected = false;

function injectStyle() {
  if (styleInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = shimmerStyle;
  document.head.appendChild(style);
  styleInjected = true;
}

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  injectStyle();

  return (
    <div
      data-slot="skeleton"
      className={cn("relative overflow-hidden rounded-md", className)}
      style={{ backgroundColor: "#d1d5db" }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          animation: "skeleton-shimmer 1.5s ease-in-out infinite",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

export { Skeleton };
