"use client";

import { useEffect, useMemo, useReducer, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import room from "@/room.json";
import { draw0or1, drawRoom } from "./util/draw";
import DoorSelector from "./components/DoorSelector";
import GameInfoPanel from "./components/GameInfoPanel";
import IntroScreen from "./components/IntroScreen";
import StoryDialog from "./components/StoryDialog";
import { Round, Door, GameState, GameAction } from "@/app/types";
import { useToggle } from "./hooks/useToggle";

const initialGameState: GameState = {
  heart: 10,
  playerChoice: [],
  round: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ASSIGN_ROUND":
      return {
        ...state,
        round: [...state.round, action.payload] as Round[],
      };
    case "PLAYER_CHOICE":
      return {
        ...state,
        playerChoice: [...state.playerChoice, action.payload.choice] as ("red" | "blue")[],
        heart: Math.min(10, Math.max(0, state.heart + action.payload.hpDelta)),
      };
    default:
      return state;
  }
}

const MAX_ROUNDS = 10;

export default function Home() {
  const router = useRouter();
  const roomData = room as Door[];
  const { shelters, asuras } = useMemo(() => roomData.reduce(
    (acc, item) => {
      if (item.type === "Shelter") acc.shelters.push(item);
      else if (item.type === "Asura") acc.asuras.push(item);
      return acc;
    },
    { shelters: [] as Door[], asuras: [] as Door[] }
  ), [roomData]);

  // Intro state
  const [showIntro, setShowIntro] = useState(true);

  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const { heart, playerChoice, round } = gameState;
  const { open: isStoryDialogOpen, toggleOpen: openStoryDialog, toggleClose: closeStoryDialog } = useToggle();

  // Gemini API interaction states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const { currentRound, currentChoice, currentRedDoor, currentBlueDoor } = useMemo(() => {
    return { 
      currentRound: round[round.length - 1],
      currentChoice: playerChoice[playerChoice.length - 1],
      currentRedDoor: round[round.length - 1]?.redDoor,
      currentBlueDoor: round[round.length - 1]?.blueDoor
    };
  }, [round, playerChoice]);
  const isGameOver = heart <= 0 || (round.length === MAX_ROUNDS && playerChoice.length === round.length);

  const handleFinishGame = () => {
    sessionStorage.setItem("rdbd:result", JSON.stringify(gameState));
    router.push("/results");
  };

  const handleNextRound = () => {
    if (isGameOver) {
      handleFinishGame();
      return;
    }
    if ( round.length >= MAX_ROUNDS ) {
      console.warn("已達最大回合數，無法再分配門扉");
      return;
    }
    if ( round.length > playerChoice.length ) {
      console.warn("本回合門扉已分配，等待玩家選擇後再分配下一回合門扉");
      return;
    };
    closeStoryDialog();
    setOutput("");
    const num = draw0or1();
    if (num === 0) {
      const redDoor = drawRoom(shelters);
      const blueDoor = drawRoom(asuras);
      if (!redDoor || !blueDoor) return;
      dispatch({
        type: "ASSIGN_ROUND",
        payload: {
          redDoor,
          blueDoor,
        },
      });
    } else {
      const redDoor = drawRoom(asuras);
      const blueDoor = drawRoom(shelters);
      if (!redDoor || !blueDoor) return;
      dispatch({
        type: "ASSIGN_ROUND",
        payload: {
          redDoor,
          blueDoor,
        },
      });
    }
  };

  const handlePlayerChoice = (choice: "red" | "blue") => {
    if ( round.length === 0 ) {
      console.warn("尚未分配門扉，無法選擇");
      return;
    }
    if ( round.length <= playerChoice.length ) {
      console.warn("本回合門扉已選擇，無法重複選擇");
      return;
    }

    if (!currentRound) return;
    const hpDelta =
      choice === "red"
        ? currentRound.redDoor.hp_change || 0
        : currentRound.blueDoor.hp_change || 0;
    dispatch({ type: "PLAYER_CHOICE", payload: { choice, hpDelta } });
    openStoryDialog();
  }
  
  const submitGemini = useCallback(async (prompt: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "API 發生錯誤。");
        return;
      }

      setOutput(data?.text ?? JSON.stringify(data, null, 2));
      // 檢查有無回傳 之後要刪除
      setTimeout(() => {
        console.log("output", output);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法連線到 API。");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    handleNextRound();
  };

  // 監控玩家選擇門的情況
  useEffect(() => {
    if (playerChoice.length === round.length && currentChoice) {
      console.log(`玩家選擇了 ${currentChoice} 門`);
      const roundNum = playerChoice.length;
      const doorKey = currentChoice === "red" ? "redDoor" : "blueDoor";
      const currentRoundChose = round[roundNum - 1][doorKey];

      const prompt = `
        我進入了第 ${roundNum} 間房間 幫我說故事
        【房間屬性】：${currentRoundChose.type === "Shelter" ? "庇護所" : "修羅場"}
        【場景名稱】：${currentRoundChose.name}
        【環境特徵】：${currentRoundChose.env_features}
        【資源物資】：${currentRoundChose.resource_desc ?? "無"}
        【潛在威脅】：${currentRoundChose.threat_desc ?? "無"}
        【血量變化】：${currentRoundChose.hp_change}
        【玩家變化後的血量】：${heart}
        - 請用中文以第二人稱幫我說一個 500 字以內的故事
        - 除非玩家死亡 或 成功通關 否則 故事的結尾都要接回 純白迴廊 眼前有兩道紅藍門 並且不要反問我問題
        - 不能額外描述門的詳細外觀
        - 【玩家變化後的血量】如果為 0 代表玩家已在房間的遭遇中死亡
        - 如果玩家進入到 第 ${MAX_ROUNDS} 房間 並且 沒有死亡 代表玩家成功通關
        `
      submitGemini(prompt);
    }
  }, [playerChoice, round, currentChoice, heart, submitGemini]);

  // Intro screen
  if (showIntro) {
    return <IntroScreen onStart={handleIntroComplete} />;
  }

  const showDoorSelection = round.length > 0 && playerChoice.length !== round.length;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100svh",
      }}
    >
      {/* Background Image & Door Selector */}
      <DoorSelector
        showDoorSelection={showDoorSelection}
        onSelect={handlePlayerChoice}
      />
      {/* Game Info Panel */}
      <GameInfoPanel
        heart={heart}
        currentRound={round.length}
        maxRounds={MAX_ROUNDS}
      />
      {/* Story Dialog */}
      <StoryDialog
        open={isStoryDialogOpen}
        onClose={closeStoryDialog}
        currentChoice={currentChoice}
        currentRedDoor={currentRedDoor}
        currentBlueDoor={currentBlueDoor}
        loading={loading}
        error={error}
        output={output}
        isGameOver={isGameOver}
        onNextRound={handleNextRound}
        onFinishGame={handleFinishGame}
      />
    </Box>
  );
}
