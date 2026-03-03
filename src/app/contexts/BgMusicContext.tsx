"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

type BgMusicContextValue = {
  play: () => void;
};

const BgMusicContext = createContext<BgMusicContextValue | null>(null);

export function BgMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const btnSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    btnSoundRef.current = new Audio("/Button Press Device.mp3");
    btnSoundRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, [role='button']")) {
        const audio = btnSoundRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.2;
    audioRef.current.play().catch(console.error);
  };

  return (
    <BgMusicContext.Provider value={{ play }}>
      <audio ref={audioRef} src="/Lost Signals.mp3" loop />
      {children}
    </BgMusicContext.Provider>
  );
}

export function useBgMusic(): BgMusicContextValue {
  const context = useContext(BgMusicContext);
  if (!context) throw new Error("useBgMusic must be used within a BgMusicProvider");
  return context;
}
