import type { Dispatch, RefObject, SetStateAction } from "react";

export interface Song {
  id: string;
  title: string;
  artist: string;
  audio: string;
  cover: string;
  duration?: number;
}

export interface PlayerContextType {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;

  isPlaying: boolean;

  setSong: (song: Song) => void;
  playSong: (song: Song) => void;

  next: () => void;
  previous: () => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (from: number, to: number) => void;

  togglePlay: () => void;
  seek: (time: number) => void;

  currentTime: number;
  duration: number;

  repeatOne: boolean;
  setRepeatOne: Dispatch<SetStateAction<boolean>>;

  audioRef: RefObject<HTMLAudioElement | null>;
}