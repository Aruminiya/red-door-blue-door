import { useCallback, useMemo, useReducer } from "react";
import type { Door, GameAction, GameState, Round } from "@/app/types";
import { draw0or1, drawRoom } from "@/app/util/draw";

type UseGameStateOptions = {
  shelters: Door[];
  asuras: Door[];
  maxRounds?: number;
  maxHeart?: number;
  initialHeart?: number;
  persistKey?: string;
  onFinish?: (state: GameState) => void;
};

export type AssignRoundResult =
  | { ok: true }
  | {
      ok: false;
      reason: "game_over" | "max_rounds" | "round_not_resolved" | "draw_failed";
    };

export type ChooseDoorResult =
  | { ok: true; hpDelta: number }
  | { ok: false; reason: "no_round" | "already_chosen" };

const DEFAULT_MAX_ROUNDS = 10;
const DEFAULT_MAX_HEART = 10;
const DEFAULT_INITIAL_HEART = 10;

export const createInitialGameState = (
  initialHeart: number,
  maxHeart: number
): GameState => ({
  heart: Math.min(maxHeart, Math.max(0, initialHeart)),
  playerChoice: [],
  round: [],
});

const createGameReducer =
  (maxHeart: number) =>
  (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
      case "ASSIGN_ROUND":
        return {
          ...state,
          round: [...state.round, action.payload] as Round[],
        };
      case "PLAYER_CHOICE":
        return {
          ...state,
          playerChoice: [...state.playerChoice, action.payload.choice] as (
            | "red"
            | "blue"
          )[],
          heart: Math.min(
            maxHeart,
            Math.max(0, state.heart + action.payload.hpDelta)
          ),
        };
      default:
        return state;
    }
  };

export function useGameState({
  shelters,
  asuras,
  maxRounds = DEFAULT_MAX_ROUNDS,
  maxHeart = DEFAULT_MAX_HEART,
  initialHeart = DEFAULT_INITIAL_HEART,
  persistKey,
  onFinish,
}: UseGameStateOptions) {
  const [gameState, dispatch] = useReducer(
    createGameReducer(maxHeart),
    createInitialGameState(initialHeart, maxHeart)
  );

  const { heart, playerChoice, round } = gameState;

  const { currentRound, currentChoice, currentRedDoor, currentBlueDoor } =
    useMemo(() => {
      const latestRound = round[round.length - 1];
      return {
        currentRound: latestRound,
        currentChoice: playerChoice[playerChoice.length - 1],
        currentRedDoor: latestRound?.redDoor,
        currentBlueDoor: latestRound?.blueDoor,
      };
    }, [round, playerChoice]);

  const isGameOver =
    heart <= 0 ||
    (round.length === maxRounds && playerChoice.length === round.length);

  const finishGame = useCallback(() => {
    if (typeof window !== "undefined" && persistKey) {
      sessionStorage.setItem(persistKey, JSON.stringify(gameState));
    }
    onFinish?.(gameState);
  }, [gameState, onFinish, persistKey]);

  const assignRound = useCallback((): AssignRoundResult => {
    if (isGameOver) return { ok: false, reason: "game_over" };
    if (round.length >= maxRounds) return { ok: false, reason: "max_rounds" };
    if (round.length > playerChoice.length) {
      return { ok: false, reason: "round_not_resolved" };
    }

    const num = draw0or1();
    const redDoor = num === 0 ? drawRoom(shelters) : drawRoom(asuras);
    const blueDoor = num === 0 ? drawRoom(asuras) : drawRoom(shelters);

    if (!redDoor || !blueDoor) return { ok: false, reason: "draw_failed" };

    dispatch({
      type: "ASSIGN_ROUND",
      payload: { redDoor, blueDoor },
    });

    return { ok: true };
  }, [asuras, shelters, isGameOver, maxRounds, playerChoice.length, round.length]);

  const chooseDoor = useCallback(
    (choice: "red" | "blue"): ChooseDoorResult => {
      if (round.length === 0 || !currentRound) {
        return { ok: false, reason: "no_round" };
      }
      if (round.length <= playerChoice.length) {
        return { ok: false, reason: "already_chosen" };
      }

      const hpDelta =
        choice === "red"
          ? currentRound.redDoor.hp_change || 0
          : currentRound.blueDoor.hp_change || 0;

      dispatch({ type: "PLAYER_CHOICE", payload: { choice, hpDelta } });
      return { ok: true, hpDelta };
    },
    [currentRound, playerChoice.length, round.length]
  );

  return {
    gameState,
    heart,
    playerChoice,
    round,
    currentRound,
    currentChoice,
    currentRedDoor,
    currentBlueDoor,
    isGameOver,
    maxHeart,
    maxRounds,
    assignRound,
    chooseDoor,
    finishGame,
  };
}
