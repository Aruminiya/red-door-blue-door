"use client";

import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import DoorSelector from "./components/DoorSelector";
import GameInfoPanel from "./components/GameInfoPanel";
import IntroScreen from "./components/IntroScreen";
import RoomRevealScreen, { type RoomRevealHandle } from "./components/RoomRevealScreen";
import StoryDialog from "./components/StoryDialog";
import { useGame } from "./contexts/GameContext";
import { useAppSettings } from "./contexts/AppSettingsContext";
import { useStoryGenerator } from "./hooks/useStoryGenerator";
import { useToggle } from "./hooks/useToggle";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const { play: playBgMusic, aiStoryEnabled } = useAppSettings();
  const roomRevealRef = useRef<RoomRevealHandle>(null);

  const {
    heart,
    playerChoice,
    round,
    currentRound,
    currentChoice,
    currentRedDoor,
    currentBlueDoor,
    isGameOver,
    maxRounds,
    assignRound,
    chooseDoor,
    finishGame,
  } = useGame();

  const { open: isStoryDialogOpen, toggleOpen: openStoryDialog, toggleClose: closeStoryDialog } = useToggle();
  const { loading, error, output, clearOutput } = useStoryGenerator({
    currentRound,
    currentChoice,
    playerChoiceCount: playerChoice.length,
    roundCount: round.length,
    heart,
    maxRounds,
    aiStoryEnabled,
  });

  const handleNextRound = () => {
    if (isGameOver) {
      finishGame();
      return;
    }
    closeStoryDialog();
    clearOutput();
    roomRevealRef.current?.clear();

    setTimeout(() => {
      const result = assignRound();
      if (!result.ok) {
        console.warn(`無法分配門扉: ${result.reason}`);
      }
    }, 1000); // 等待房間揭示動畫結束 再分配下一回合，避免動畫與狀態更新衝突
  };

  const UNLOCKED_ROOMS_KEY = "rdbd:unlocked_rooms";

  const handlePlayerChoice = (choice: "red" | "blue") => {
    const result = chooseDoor(choice);
    if (result.ok) {
      const chosenDoor = choice === "red" ? currentRedDoor : currentBlueDoor;

      let isNewRoom = false;
      const id = chosenDoor?.id;
      if (id !== undefined) {
        const prev = JSON.parse(localStorage.getItem(UNLOCKED_ROOMS_KEY) ?? "[]") as number[];
        isNewRoom = !prev.includes(id);
        if (isNewRoom) {
          localStorage.setItem(UNLOCKED_ROOMS_KEY, JSON.stringify([...prev, id]));
        }
      }

      roomRevealRef.current?.show(chosenDoor?.imageUrl ?? null, chosenDoor?.name, chosenDoor?.type, isNewRoom);
    } else {
      console.warn(`無法選擇門扉: ${result.reason}`);
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    playBgMusic();
    handleNextRound();
  };

  // 回合分配後立即預先載入兩張房間圖像，
  // 這樣瀏覽器在玩家點擊前就能快取它們。
  useEffect(() => {
    [currentRedDoor?.imageUrl, currentBlueDoor?.imageUrl].forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [currentRedDoor, currentBlueDoor]);

  const showDoorSelection = round.length > 0 && playerChoice.length !== round.length;

  return (
    <>
      {/* Intro screen */}
      {showIntro ? (
        <IntroScreen onStartAction={handleIntroComplete} />
      ) : (
        <Box
          sx={{
            position: "relative",
            height: "100svh",
          }}
        >
          {/* Background Image & Door Selector */}
          <DoorSelector
            showDoorSelection={showDoorSelection}
            onSelectAction={handlePlayerChoice}
          />
          {/* Game Info Panel */}
          <GameInfoPanel
            heart={heart}
            currentRound={round.length}
            maxRounds={maxRounds}
          />
          {/* Story Dialog */}
          <StoryDialog
            open={isStoryDialogOpen}
            onCloseAction={closeStoryDialog}
            currentChoice={currentChoice}
            currentRedDoor={currentRedDoor}
            currentBlueDoor={currentBlueDoor}
            loading={loading}
            error={error}
            output={output}
            isGameOver={isGameOver}
            onNextRoundAction={handleNextRound}
            onFinishGameAction={finishGame}
            heart={heart}
            currentRound={round.length}
            maxRounds={maxRounds}
          />
        </Box>
      )}

      {/* Room Reveal — manages full-screen overlay + blurred background internally */}
      <RoomRevealScreen
        ref={roomRevealRef}
        onCompleteAction={openStoryDialog}
      />
    </>
  );
}
