"use client";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import type { Door } from "@/app/types";
import DoorData from "./DoorData";
import FavoriteIcon from "@mui/icons-material/Favorite";

type StoryDialogProps = {
  open: boolean;
  onCloseAction: () => void;
  currentChoice: "red" | "blue" | undefined;
  currentRedDoor: Door | undefined;
  currentBlueDoor: Door | undefined;
  loading: boolean;
  error: string | null;
  output: string;
  isGameOver: boolean;
  onNextRoundAction: () => void;
  onFinishGameAction: () => void;
  heart: number;
  currentRound: number;
  maxRounds: number;
};

export default function StoryDialog({
  open,
  onCloseAction,
  currentChoice,
  currentRedDoor,
  currentBlueDoor,
  loading,
  error,
  output,
  isGameOver,
  onNextRoundAction,
  onFinishGameAction,
  heart,
  currentRound,
  maxRounds,
}: StoryDialogProps) {
  useEffect(() => {
    if (open) {
      new Audio("/Paper.mp3").play().catch(() => {});
    }
  }, [open]);

  const currentDoor = currentChoice === "red" ? currentRedDoor : currentBlueDoor;
  const isShelter = currentDoor ? currentDoor.type === "Shelter" : true;
  const tone = "dark";

  const palette = {
    bg: "rgba(11,15,22,0.97)",
    border: "rgba(255,255,255,0.1)",
    text: "#eef1f7",
    muted: "rgba(238,241,247,0.45)",
    outputBg: "rgba(255,255,255,0.04)",
    progressTrack: "rgba(255,255,255,0.08)",
  };

  const accent = isShelter ? "#2ecc71" : "#e74c3c";
  const doorLabel = currentChoice === "red" ? "紅色門扉" : "藍色門扉";

  const handleAction = () => {
    if (isGameOver) {
      onFinishGameAction();
    } else {
      new Audio("/DeepWhoosh.mp3").play().catch(() => {});
      onNextRoundAction();
      onCloseAction();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: palette.bg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 2,
            border: `1px solid ${palette.border}`,
            borderTop: `3px solid ${accent}`,
            color: palette.text,
            overflow: "hidden",
          },
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.25,
          pb: 2,
          borderBottom: `1px solid ${palette.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        {/* Left: door choice */}
        <Box>
          <Typography
            sx={{
              fontSize: "0.62rem",
              color: palette.muted,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            你選了
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: "0.1em",
              lineHeight: 1,
            }}
          >
            {doorLabel}
          </Typography>
        </Box>

        {/* Right: HP + Round */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.75 }}>
          {/* Round */}
          <Typography sx={{ fontSize: "0.72rem", color: palette.muted, letterSpacing: "0.08em" }}>
            第{" "}
            <Box component="span" sx={{ fontWeight: 700, color: palette.text }}>
              {currentRound}
            </Box>
            {" "}/ {maxRounds} 回合
          </Typography>

          {/* HP pips + number */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", gap: "2.5px" }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "1.5px",
                    bgcolor: i < heart ? accent : "rgba(255,255,255,0.1)",
                    boxShadow: i < heart && heart <= 3 ? `0 0 4px ${accent}88` : "none",
                    transition: "background-color 0.2s",
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <FavoriteIcon sx={{ fontSize: "0.72rem", color: accent }} />
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: accent, letterSpacing: "0.04em" }}>
                {heart}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Content ── */}
      <DialogContent sx={{ p: 0 }}>
        <Stack>
          {/* DoorData card */}
          {currentRedDoor && currentBlueDoor && (
            <Box sx={{ p: 2 }}>
              {currentChoice === "red" ? (
                <DoorData doorData={currentRedDoor} doorColor="red" tone={tone} isShowDoorColor={false} />
              ) : (
                <DoorData doorData={currentBlueDoor} doorColor="blue" tone={tone} isShowDoorColor={false} />
              )}
            </Box>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ px: 2.5, py: 2.5 }}>
              <LinearProgress
                sx={{
                  borderRadius: 1,
                  height: 3,
                  backgroundColor: palette.progressTrack,
                  "& .MuiLinearProgress-bar": { backgroundColor: accent, borderRadius: 1 },
                }}
              />
              <Typography
                sx={{
                  mt: 1.5,
                  textAlign: "center",
                  color: palette.muted,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                }}
              >
                正在生成故事…
              </Typography>
            </Box>
          )}

          {/* Error */}
          {error && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {/* Story Output */}
          {output && (
            <Box sx={{ px: 2, pb: 2.5, pt: output && !loading ? 0.5 : 0 }}>
              <Box
                sx={{
                  borderLeft: `2px solid ${accent}55`,
                  pl: 1.75,
                }}
              >
                <Box
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "var(--font-geist-mono)",
                    backgroundColor: palette.outputBg,
                    color: palette.text,
                    p: 2,
                    borderRadius: 1.5,
                    fontSize: "0.875rem",
                    lineHeight: 1.95,
                    letterSpacing: "0.02em",
                  }}
                >
                  {output}
                </Box>
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>

      {/* ── Action ── */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          borderTop: `1px solid ${palette.border}`,
        }}
      >
        <Button
          onClick={handleAction}
          disabled={loading}
          fullWidth
          sx={{
            py: 1.4,
            fontSize: "0.88rem",
            letterSpacing: "0.18em",
            borderRadius: 1.5,
            backgroundColor: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}44`,
            "&:hover": {
              backgroundColor: `${accent}2e`,
              borderColor: `${accent}88`,
            },
            "&:disabled": {
              color: palette.muted,
              borderColor: palette.border,
              backgroundColor: "transparent",
            },
          }}
        >
          {isGameOver ? "結算成績" : "下一回合"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
