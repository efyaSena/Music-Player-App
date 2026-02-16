import React, { useEffect, useRef, useState } from "react";

export default function AudioRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]); 
  // each: { id, name, url, blob, createdAt }

  // cleanup audio urls on unmount
  useEffect(() => {
    return () => {
      recordings.forEach((r) => URL.revokeObjectURL(r.url));
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        const id = crypto.randomUUID();
        setRecordings((prev) => [
          {
            id,
            name: `Recording ${prev.length + 1}`,
            url,
            blob,
            createdAt: Date.now(),
          },
          ...prev,
        ]);

        // stop mic
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert("Mic permission denied or not available.");
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
    }
    setIsRecording(false);
  };

  const renameRecording = (id, name) => {
    setRecordings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name } : r))
    );
  };

  const deleteRecording = (id) => {
    setRecordings((prev) => {
      const rec = prev.find((r) => r.id === id);
      if (rec) URL.revokeObjectURL(rec.url);
      return prev.filter((r) => r.id !== id);
    });
  };

  const downloadRecording = (rec) => {
    const a = document.createElement("a");
    a.href = rec.url;
    a.download = `${rec.name}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-8 pb-28">
      <h1 className="text-[#00FFFF] font-black text-lg text-center">
        Audio Recorder
      </h1>

      <div className="mt-8 flex justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-[#00EFFF] text-black font-black px-6 py-3 rounded-xl active:scale-95 transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-black font-black px-6 py-3 rounded-xl active:scale-95 transition"
          >
            Stop
          </button>
        )}
      </div>

      <div className="mt-10 space-y-4 max-w-md mx-auto">
        {recordings.length === 0 && (
          <p className="text-center text-white/60 text-sm">
            No recordings yet.
          </p>
        )}

        {recordings.map((rec) => (
          <div
            key={rec.id}
            className="border border-[#00EFFF]/40 rounded-2xl p-4 bg-black"
          >
            <input
              value={rec.name}
              onChange={(e) => renameRecording(rec.id, e.target.value)}
              className="w-full bg-transparent outline-none text-[#00FFFF] font-black text-sm"
            />

            <audio className="w-full mt-3" controls src={rec.url} />

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => downloadRecording(rec)}
                className="flex-1 bg-[#CFFFFF] text-black font-black py-2 rounded-xl active:scale-95 transition"
              >
                Download
              </button>
              <button
                onClick={() => deleteRecording(rec.id)}
                className="flex-1 bg-black border border-red-500 text-red-500 font-black py-2 rounded-xl active:scale-95 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
