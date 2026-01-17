import { useState } from "react";

export default function PlayerBar() {
  const [open, setOpen] = useState(false);

  const btn =
    "transition duration-200 hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_6px_#00FFFF]";

  return (
    <div className="relative bg-[#CFFFFF] rounded-xl px-6 py-5 text-black">
      <button
        type="button"
        className={`absolute top-3 right-4 text-lg font-black leading-none ${btn}`}
        aria-label="More options"
        onClick={() => setOpen((v) => !v)}
      >
        …
      </button>

      <div className="flex items-center justify-center gap-10">
        <button type="button" className={`text-sm font-black ${btn}`}>
          {"<<"}
        </button>

        <button type="button" className={`text-base font-black ${btn}`}>
          {">||"}
        </button>

        <button type="button" className={`text-sm font-black ${btn}`}>
          {">>"}
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />

          <div className="absolute top-12 right-4 z-50 bg-[#CFFFFF] rounded-xl p-4 shadow-xl w-28">
            <button
              type="button"
              className="w-full flex flex-col items-center gap-2 py-3 rounded-lg transition hover:bg-black/10 active:scale-95"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl">⬇️</span>
              <span className="text-[10px] font-bold">Download</span>
            </button>

            <button
              type="button"
              className="w-full flex flex-col items-center gap-2 py-3 rounded-lg transition hover:bg-black/10 active:scale-95"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl">🔗</span>
              <span className="text-[10px] font-bold">Share</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
