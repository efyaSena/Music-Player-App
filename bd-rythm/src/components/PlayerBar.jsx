export default function PlayerBar() {
  return (
    <div className="bg-[#CFFFFF] rounded-xl px-6 py-3 flex items-center justify-between text-black">
      <button
        type="button"
        className="text-sm font-black"
        aria-label="Previous"
      >
        {"<<"}
      </button>

      <button
        type="button"
        className="text-lg font-black"
        aria-label="Play / Pause"
      >
        ▶▶
      </button>

      <button
        type="button"
        className="text-sm font-black"
        aria-label="Next"
      >
        {">>"}
      </button>

      <button
        type="button"
        className="text-lg font-black"
        aria-label="More options"
      >
        ⋯
      </button>
    </div>
  );
}
