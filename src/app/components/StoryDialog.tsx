"use client";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import type { Door } from "@/app/types";
import DoorData from "./DoorData";

type StoryDialogProps = {
  open: boolean;
  onClose: () => void;
  currentChoice: "red" | "blue" | undefined;
  currentRedDoor: Door | undefined;
  currentBlueDoor: Door | undefined;
  loading: boolean;
  error: string | null;
  output: string;
  isGameOver: boolean;
  onNextRound: () => void;
  onFinishGame: () => void;
};

export default function StoryDialog({
  open,
  onClose,
  currentChoice,
  currentRedDoor,
  currentBlueDoor,
  loading,
  error,
  output,
  isGameOver,
  onNextRound,
  onFinishGame,
}: StoryDialogProps) {
  const handleAction = () => {
    if (isGameOver) {
      onFinishGame();
    } else {
      onNextRound();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {currentChoice === "red" ? "紅色門扉" : "藍色門扉"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
          }}
        >
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Door Result */}
          {currentRedDoor && currentBlueDoor && (
            <Stack spacing={1.5}>
              <DoorData doorData={currentRedDoor} doorColor="red" />
              <DoorData doorData={currentBlueDoor} doorColor="blue" />
            </Stack>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ py: 2 }}>
              <LinearProgress />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
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
                backgroundColor: "#f6f7fb",
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
