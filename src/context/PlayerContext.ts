import { createContext } from "react";
import type { PlayerContextType } from "../types/player";

export const PlayerContext = createContext<PlayerContextType | null>(null);