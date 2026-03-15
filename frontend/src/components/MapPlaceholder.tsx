import { MapPin } from 'lucide-react';

export function MapPlaceholder() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-lg overflow-hidden">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Simulated location markers */}
      <div className="absolute top-[25%] left-[35%] w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
      <div className="absolute top-[40%] left-[45%] w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50 animation-delay-300" />
      <div className="absolute top-[55%] left-[38%] w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50 animation-delay-600" />
      <div className="absolute top-[30%] left-[60%] w-3 h-3 bg-chart-2 rounded-full animate-pulse shadow-lg shadow-chart-2/50" />
      <div className="absolute top-[65%] left-[52%] w-3 h-3 bg-chart-2 rounded-full animate-pulse shadow-lg shadow-chart-2/50 animation-delay-300" />
      
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <line x1="35%" y1="25%" x2="45%" y2="40%" stroke="hsl(var(--primary))" strokeWidth="1" />
        <line x1="45%" y1="40%" x2="38%" y2="55%" stroke="hsl(var(--primary))" strokeWidth="1" />
        <line x1="60%" y1="30%" x2="52%" y2="65%" stroke="hsl(var(--chart-2))" strokeWidth="1" />
      </svg>
      
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-slate-500">
          <MapPin className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
