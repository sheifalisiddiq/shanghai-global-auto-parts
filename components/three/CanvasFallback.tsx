export function CanvasFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden>
      <div className="relative flex flex-col items-center justify-center p-8 text-center">
        {/* Stylized Engine Blueprint Silhouette */}
        <div className="relative mb-4 flex flex-col items-center gap-1 opacity-70">
          {/* Valve cover */}
          <div className="h-6 w-36 rounded-t border-2 border-slate-700 bg-slate-100" />
          {/* Head */}
          <div className="h-8 w-40 border-2 border-slate-700 bg-slate-200" />
          {/* Block */}
          <div className="flex h-16 w-44 items-center justify-around border-2 border-slate-800 bg-slate-100 px-2">
            <div className="h-12 w-6 rounded border border-dashed border-red-600/70" />
            <div className="h-12 w-6 rounded border border-dashed border-red-600/70" />
            <div className="h-12 w-6 rounded border border-dashed border-red-600/70" />
            <div className="h-12 w-6 rounded border border-dashed border-red-600/70" />
          </div>
          {/* Oil pan */}
          <div className="h-8 w-36 rounded-b-xl border-2 border-slate-700 bg-slate-200" />
        </div>
        <span className="font-mono text-xs tracking-widest text-slate-500 uppercase">
          Loading 3D Engine Schematic...
        </span>
      </div>
    </div>
  );
}
