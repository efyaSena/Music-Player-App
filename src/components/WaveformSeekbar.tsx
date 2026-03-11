import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../context/usePlayer";

export default function WaveformSeekbar() {
  const player = usePlayer() as any;

  const { currentSong, audioRef, duration = 0, seek } = player;

  const [bars, setBars] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);

  const waveformKey = currentSong ? `waveform:${currentSong.id}` : null;

  useEffect(() => {
    if (!currentSong?.audio || !waveformKey) return;

    const cached = localStorage.getItem(waveformKey);

    if (cached) {
      setBars(JSON.parse(cached));
      return;
    }

    const generateWaveform = async () => {
      try {
        const response = await fetch(currentSong.audio);
        const arrayBuffer = await response.arrayBuffer();

        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0);
        const samples = 70;
        const blockSize = Math.floor(rawData.length / samples);

        const filteredData = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;

          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j]);
          }

          filteredData.push(sum / blockSize);
        }

        const max = Math.max(...filteredData);
        const normalized = filteredData.map((n) => n / max);

        localStorage.setItem(waveformKey, JSON.stringify(normalized));

        setBars(normalized);
      } catch (err) {
        console.error("Waveform generation failed", err);
      }
    };

    generateWaveform();
  }, [currentSong, waveformKey]);

  useEffect(() => {
    const update = () => {
      if (audioRef?.current && duration) {
        const current = audioRef.current.currentTime;
        setProgress((current / duration) * 100);
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [audioRef, duration]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;

    seek(time);
  };

  return (
    <div
      onClick={handleSeek}
      className="relative w-full h-12 flex items-end gap-[2px] cursor-pointer select-none"
    >
      {bars.map((bar, i) => {
        const played = (i / bars.length) * 100 <= progress;

        return (
          <div
            key={i}
            style={{
              height: `${bar * 100}%`,
            }}
            className={`w-[3px] rounded ${
              played ? "bg-[#CFFFFF]" : "bg-white/30"
            }`}
          />
        );
      })}
    </div>
  );
}