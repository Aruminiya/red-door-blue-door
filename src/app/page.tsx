"use client";

import { useState, useRef } from "react";
import { Box } from "@mui/material";
import DoorSelector from "./components/DoorSelector";
import GameInfoPanel from "./components/GameInfoPanel";
import IntroScreen from "./components/IntroScreen";
import StoryDialog from "./components/StoryDialog";
import { useGame } from "./contexts/GameContext";
import { useStoryGenerator } from "./hooks/useStoryGenerator";
import { useToggle } from "./hooks/useToggle";

export default function Home() {
  // Intro state
  const [showIntro, setShowIntro] = useState(true);

  // Background music ref
  const audioRef = useRef<HTMLAudioElement>(null);

  // Game state from context
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
  });

  const handleNextRound = () => {
    if (isGameOver) {
      finishGame();
      return;
    }
    closeStoryDialog();
    clearOutput();
    const result = assignRound();
    if (!result.ok) {
      console.warn(`無法分配門扉: ${result.reason}`);
    }
  };

  const handlePlayerChoice = (choice: "red" | "blue") => {
    const result = chooseDoor(choice);
    if (result.ok) {
      openStoryDialog();
    } else {
      console.warn(`無法選擇門扉: ${result.reason}`);
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Start background music after user interaction
    audioRef.current!.volume = 0.2;
    audioRef.current?.play().catch(console.error);
    handleNextRound();
  };

  const showDoorSelection = round.length > 0 && playerChoice.length !== round.length;

  return (
    <>
      {/* Background Music - always rendered to persist across state changes */}
      <audio ref={audioRef} src="/Lost Signals.mp3" loop />

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
          />
        </Box>
      )}
    </>
  );
}
