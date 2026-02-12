"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useGameState } from "@/app/hooks/useGameState";
import { useRoomData } from "@/app/hooks/useRoomData";
import type { Door, Round } from "@/app/types";

const MAX_ROUNDS = 10;
const PERSIST_KEY = "rdbd:result";

type GameContextValue = {
  // Game state
  heart: number;
  playerChoice: ("red" | "blue")[];
  round: Round[];
  currentRound: Round | undefined;
  currentChoice: "red" | "blue" | undefined;
  currentRedDoor: Door | undefined;
  currentBlueDoor: Door | undefined;
  isGameOver: boolean;
  maxHeart: number;
  maxRounds: number;
  // Actions
  assignRound: () => { ok: true } | { ok: false; reason: string };
  chooseDoor: (choice: "red" | "blue") => { ok: true; hpDelta: number } | { ok: false; reason: string };
  finishGame: () => void;
  initGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
  children: ReactNode;
  onFinish?: () => void;
};

export function GameProvider({ children, onFinish }: GameProviderProps) {
  const { shelters, asuras } = useRoomData();

  const gameState = useGameState({
    shelters,
    asuras,
    maxRounds: MAX_ROUNDS,
    persistKey: PERSIST_KEY,
    onFinish,
  });

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

// Re-export constants for external use
export { MAX_ROUNDS, PERSIST_KEY };
