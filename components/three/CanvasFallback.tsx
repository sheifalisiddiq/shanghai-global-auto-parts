export function CanvasFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden>
      <div className="border-steel/40 absolute size-56 animate-[spin_18s_linear_infinite] rounded-full border-[3px] border-dashed sm:size-72" />
      <div className="border-brand-red/70 absolute size-40 animate-[spin_12s_linear_infinite_reverse] rounded-full border-[10px] border-t-transparent border-r-transparent sm:size-52" />
      <div className="bg-ink absolute size-16 rounded-full sm:size-20" />
    </div>
  );
}
