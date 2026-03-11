import { usePlayer } from "../context/usePlayer";

export default function ProgressBar() {
  const { currentTime, duration, seek } = usePlayer() as any;

  const formatTime = (t: number) => {
    if (!t || !isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full mt-4">
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime || 0}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full accent-cyan-400 cursor-pointer"
      />

      <div className="flex justify-between text-xs mt-1 opacity-80">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}