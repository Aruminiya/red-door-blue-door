"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const STORAGE_KEY = "rdbd:settings";

type Settings = {
  bgMusicVolume: number;
  bgMusicEnabled: boolean;
  sfxEnabled: boolean;
  sfxVolume: number;
};

const DEFAULT_SETTINGS: Settings = { bgMusicVolume: 0.2, bgMusicEnabled: true, sfxEnabled: true, sfxVolume: 0.5 };

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

type BgMusicContextValue = {
  play: () => void;
  bgMusicVolume: number;
  bgMusicEnabled: boolean;
  sfxEnabled: boolean;
  sfxVolume: number;
  setBgMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  toggleBgMusic: () => void;
  toggleSfx: () => void;
};

const BgMusicContext = createContext<BgMusicContextValue | null>(null);

export function BgMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const btnSoundRef = useRef<HTMLAudioElement | null>(null);

  const [bgMusicVolume, setBgMusicVolumeState] = useState<number>(0.2);
  const [bgMusicEnabled, setBgMusicEnabled] = useState<boolean>(true);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [sfxVolume, setSfxVolumeState] = useState<number>(0.5);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const s = loadSettings();
    setBgMusicVolumeState(s.bgMusicVolume);
    setBgMusicEnabled(s.bgMusicEnabled);
    setSfxEnabled(s.sfxEnabled);
    setSfxVolumeState(s.sfxVolume);
    setInitialized(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bgMusicVolume, bgMusicEnabled, sfxEnabled, sfxVolume }));
  }, [bgMusicVolume, bgMusicEnabled, sfxEnabled, sfxVolume, initialized]);

  // Sync audio volume/pause on state change
  useEffect(() => {
    if (!audioRef.current) return;
    if (bgMusicEnabled) {
      audioRef.current.volume = bgMusicVolume;
    } else {
      audioRef.current.pause();
    }
  }, [bgMusicVolume, bgMusicEnabled]);

  useEffect(() => {
    btnSoundRef.current = new Audio("/Button Press Device.mp3");
    btnSoundRef.current.volume = sfxVolume;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync sfx volume
  useEffect(() => {
    if (btnSoundRef.current) btnSoundRef.current.volume = sfxVolume;
  }, [sfxVolume]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, [role='button']")) {
        if (!sfxEnabled) return;
        const audio = btnSoundRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [sfxEnabled]);

  const play = () => {
    if (!audioRef.current) return;
    if (!bgMusicEnabled) return;
    audioRef.current.volume = bgMusicVolume;
    audioRef.current.play().catch(console.error);
  };

  const setBgMusicVolume = (v: number) => {
    setBgMusicVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const toggleBgMusic = () => {
    setBgMusicEnabled((prev) => {
      const next = !prev;
      if (!next) {
        audioRef.current?.pause();
      } else {
        if (audioRef.current) {
          audioRef.current.volume = bgMusicVolume;
          audioRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const setSfxVolume = (v: number) => setSfxVolumeState(v);

  const toggleSfx = () => setSfxEnabled((prev) => !prev);

  return (
    <BgMusicContext.Provider value={{ play, bgMusicVolume, bgMusicEnabled, sfxEnabled, sfxVolume, setBgMusicVolume, setSfxVolume, toggleBgMusic, toggleSfx }}>
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
