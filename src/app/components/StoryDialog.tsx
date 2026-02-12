"use client";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import type { Door } from "@/app/types";
import DoorData from "./DoorData";

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
}: StoryDialogProps) {
  const currentDoor = currentChoice === "red" ? currentRedDoor : currentBlueDoor;
  const isShelter = currentDoor ? currentDoor.type === "Shelter" : true;
  const tone = isShelter ? "light" : "dark";
  const palette = isShelter
    ? {
        background: "rgba(255, 255, 255, 0.98)",
        surface: "#ffffff",
        text: "#14171f",
        muted: "rgba(20, 23, 31, 0.6)",
        border: "rgba(20, 23, 31, 0.12)",
        outputBg: "#f6f7fb",
        progressTrack: "rgba(20, 23, 31, 0.12)",
        progressBar: "#2b74ff",
      }
    : {
        background: "rgba(16, 22, 31, 0.98)",
        surface: "#0f141c",
        text: "#f5f7fb",
        muted: "rgba(245, 247, 251, 0.65)",
        border: "rgba(245, 247, 251, 0.18)",
        outputBg: "#0f1622",
        progressTrack: "rgba(245, 247, 251, 0.15)",
        progressBar: "#6ea2ff",
      };

  const handleAction = () => {
    if (isGameOver) {
      onFinishGameAction();
    } else {
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
            backgroundColor: palette.background,
            backdropFilter: "blur(8px)",
            borderRadius: 1,
            border: `1px solid ${palette.border}`,
            color: palette.text,
          },
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Typography
          variant="h6"
          component="span"
          sx={{ 
            fontWeight: 600,
            color: palette.text,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {currentChoice === "red" ? "你選了 紅色門扉" : "你選了 藍色門扉"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: palette.border }}>
        <Stack spacing={2}>
          {/* Door Result */}
          {currentRedDoor && currentBlueDoor && (
            <Stack spacing={1.5}>
              {currentChoice === "red" ? (
                 <DoorData doorData={currentRedDoor} doorColor="red" tone={tone} isShowDoorColor={false} />
              ) : (
                <DoorData doorData={currentBlueDoor} doorColor="blue" tone={tone} isShowDoorColor={false} />
              )}
            </Stack>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ py: 2 }}>
              <LinearProgress
                sx={{
                  backgroundColor: palette.progressTrack,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: palette.progressBar,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  textAlign: "center",
                  color: palette.muted,
                }}
              >
                正在生成故事...
              </Typography>
            </Box>
          )}

          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Story Output */}
          {output && (
            <Box
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "var(--font-geist-mono)",
                backgroundColor: palette.outputBg,
                color: palette.text,
                p: 2,
                borderRadius: 2,
                fontSize: "0.9rem",
                lineHeight: 1.8,
              }}
            >
              {output}
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleAction}
          disabled={loading}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {isGameOver ? "結算成績" : "下一回合"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
