"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

type HowToPlayDialogProps = {
  open: boolean;
  onCloseAction: () => void;
};

const palette = {
  bg: "rgba(11,15,22,0.97)",
  border: "rgba(255,255,255,0.1)",
  text: "#eef1f7",
  muted: "rgba(238,241,247,0.4)",
  divider: "rgba(255,255,255,0.07)",
};

const sections = [
  {
    label: "基本規則",
    accent: "rgba(255,255,255,0.25)",
    items: [
      "每局共 10 回合，初始血量 ❤️ 10",
      "每回合在紅門與藍門中選擇一扇",
    ],
  },
  {
    label: "房間類型",
    accent: "rgba(255,255,255,0.25)",
    items: [
      { text: "避難所 Shelter — 恢復 HP", color: "#2ecc71" },
      { text: "修羅場 Asura　 — 消耗 HP", color: "#e74c3c" },
    ],
  },
  {
    label: "勝敗條件",
    accent: "rgba(255,255,255,0.25)",
    items: [
      "通關：完成 10 回合且血量 > 0",
      "失敗：血量歸零",
    ],
  },
  {
    label: "場景搜集",
    accent: "rgba(255,255,255,0.25)",
    items: [
      "每次進入的房間都會解鎖收藏紀錄",
      "前往「場景搜集」可查看 100 個場景的解鎖進度",
    ],
  },
];

export default function HowToPlayDialog({ open, onCloseAction }: HowToPlayDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: palette.bg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 2,
            border: `1px solid ${palette.border}`,
            borderTop: "3px solid rgba(232,201,106,0.6)",
            color: palette.text,
            overflow: "hidden",
          },
        },
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.6)" } },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.25,
          pb: 2,
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.62rem",
            color: palette.muted,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          Game Guide
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.15rem",
            letterSpacing: "0.1em",
            color: "#e8c96a",
          }}
        >
          遊戲說明
        </Typography>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {sections.map((section, si) => (
            <Box
              key={si}
              sx={{
                px: 2.5,
                py: 2,
                borderBottom: si < sections.length - 1
                  ? `1px solid ${palette.divider}`
                  : "none",
              }}
            >
              {/* Section label */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
                <Box
                  sx={{
                    width: 3,
                    height: 12,
                    borderRadius: "2px",
                    bgcolor: "rgba(232,201,106,0.45)",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: palette.muted,
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {section.label}
                </Typography>
              </Box>

              {/* Items */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, pl: 0.5 }}>
                {section.items.map((item, ii) => {
                  const isObj = typeof item === "object";
                  return (
                    <Typography
                      key={ii}
                      sx={{
                        color: isObj ? (item as { color: string }).color : "rgba(238,241,247,0.75)",
                        fontSize: "0.875rem",
                        lineHeight: 1.7,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {isObj ? (item as { text: string }).text : item}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          borderTop: `1px solid ${palette.border}`,
        }}
      >
        <Button
          fullWidth
          onClick={onCloseAction}
          sx={{
            py: 1.2,
            fontSize: "0.85rem",
            letterSpacing: "0.18em",
            borderRadius: 1.5,
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.12)",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.35)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.85)",
            },
          }}
        >
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
}
